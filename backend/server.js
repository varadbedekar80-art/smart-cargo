const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authMiddleware = require('./middleware/authMiddleware')

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors())
app.use(express.json())


// ==============================
// HOME ROUTE
// ==============================

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Cargo Backend API is running!'
  })
})


// ==============================
// DATABASE HEALTH CHECK
// ==============================

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')

    res.json({
      status: 'OK',
      message: 'Backend and PostgreSQL are connected',
      databaseTime: result.rows[0].now
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed'
    })
  }
})


// ==============================
// GET ALL USERS
// ==============================

app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const result = await pool.query(
      `SELECT id, name, email, role, status, created_at
       FROM users
       ORDER BY id DESC`
    )

    res.json(result.rows)

  } catch (error) {
    console.error('GET USERS ERROR:', error)

    res.status(500).json({
      message: 'Failed to fetch users'
    })
  }
})


// ==============================
// UPDATE USER STATUS
// ==============================

app.put('/api/users/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const userId = req.params.id
    const { status } = req.body

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      })
    }

    if (String(userId) === String(req.user.id)) {
      return res.status(400).json({
        message: 'You cannot change your own account status'
      })
    }

    const result = await pool.query(
      `UPDATE users
       SET status = $1
       WHERE id = $2
       RETURNING id, name, email, role, status`,
      [status, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.json({
      message: 'User status updated successfully',
      user: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE USER STATUS ERROR:', error)

    res.status(500).json({
      message: 'Failed to update user status'
    })
  }
})


// ==============================
// ADMIN BUSINESS MANAGEMENT
// ==============================

app.get('/api/admin/businesses', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const result = await pool.query(
      `SELECT
        bp.id,
        bp.user_id,
        bp.business_name,
        bp.phone,
        bp.business_type,
        bp.registration_number,
        bp.address,
        bp.city,
        bp.country,
        u.name AS owner_name,
        u.email AS owner_email,
        u.status
       FROM business_profiles bp
       INNER JOIN users u
         ON bp.user_id = u.id
       ORDER BY bp.id DESC`
    )

    return res.status(200).json(result.rows)

  } catch (error) {
    console.error('GET ADMIN BUSINESSES ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch businesses'
    })
  }
})


// ==============================
// REGISTER USER
// ==============================

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      })
    }

    const userRole = role || 'Business User'

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: 'User with this email already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, status, created_at`,
      [name, email, hashedPassword, userRole]
    )

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Registration failed'
    })
  }
})


// ==============================
// LOGIN USER
// ==============================

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        message: 'Your account is inactive'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Login failed'
    })
  }
})


// ==============================
// GET CURRENT AUTHENTICATED USER
// ==============================

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, status, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.json({
      message: 'Authenticated user',
      user: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch user'
    })
  }
})


// ==============================
// USER SETTINGS
// ==============================

// GET USER SETTINGS

app.get('/api/settings', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        email_notifications,
        shipment_updates,
        payment_notifications,
        document_notifications,
        language,
        currency
       FROM user_settings
       WHERE user_id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      const defaultResult = await pool.query(
        `INSERT INTO user_settings (
          user_id,
          email_notifications,
          shipment_updates,
          payment_notifications,
          document_notifications,
          language,
          currency
        )
        VALUES ($1, TRUE, TRUE, TRUE, TRUE, 'English', 'USD')
        RETURNING
          email_notifications,
          shipment_updates,
          payment_notifications,
          document_notifications,
          language,
          currency`,
        [req.user.id]
      )

      return res.json(defaultResult.rows[0])
    }

    res.json(result.rows[0])

  } catch (error) {
    console.error('GET Settings Error:', error)

    res.status(500).json({
      message: 'Failed to fetch settings'
    })
  }
})


// UPDATE USER SETTINGS

app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const {
      email_notifications,
      shipment_updates,
      payment_notifications,
      document_notifications,
      language,
      currency
    } = req.body

    const result = await pool.query(
      `INSERT INTO user_settings (
        user_id,
        email_notifications,
        shipment_updates,
        payment_notifications,
        document_notifications,
        language,
        currency
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        email_notifications = EXCLUDED.email_notifications,
        shipment_updates = EXCLUDED.shipment_updates,
        payment_notifications = EXCLUDED.payment_notifications,
        document_notifications = EXCLUDED.document_notifications,
        language = EXCLUDED.language,
        currency = EXCLUDED.currency,
        updated_at = CURRENT_TIMESTAMP
      RETURNING
        email_notifications,
        shipment_updates,
        payment_notifications,
        document_notifications,
        language,
        currency`,
      [
        req.user.id,
        email_notifications ?? true,
        shipment_updates ?? true,
        payment_notifications ?? true,
        document_notifications ?? true,
        language || 'English',
        currency || 'USD'
      ]
    )

    res.json({
      message: 'Settings saved successfully',
      settings: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE Settings Error:', error)

    res.status(500).json({
      message: 'Failed to save settings'
    })
  }
})


// ==============================
// BUSINESS PROFILE
// ==============================

// GET BUSINESS PROFILE

app.get('/api/business-profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        bp.business_name,
        bp.phone,
        bp.business_type,
        bp.registration_number,
        bp.address,
        bp.city,
        bp.country
       FROM users u
       LEFT JOIN business_profiles bp
         ON u.id = bp.user_id
       WHERE u.id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User profile not found'
      })
    }

    res.json(result.rows[0])

  } catch (error) {
    console.error('GET Business Profile Error:', error)

    res.status(500).json({
      message: 'Failed to fetch business profile'
    })
  }
})


// CREATE / UPDATE BUSINESS PROFILE

app.put('/api/business-profile', authMiddleware, async (req, res) => {
  try {
    const {
      business_name,
      phone,
      business_type,
      registration_number,
      address,
      city,
      country
    } = req.body

    const result = await pool.query(
      `INSERT INTO business_profiles (
        user_id,
        business_name,
        phone,
        business_type,
        registration_number,
        address,
        city,
        country
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id)
      DO UPDATE SET
        business_name = EXCLUDED.business_name,
        phone = EXCLUDED.phone,
        business_type = EXCLUDED.business_type,
        registration_number = EXCLUDED.registration_number,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        req.user.id,
        business_name || null,
        phone || null,
        business_type || null,
        registration_number || null,
        address || null,
        city || null,
        country || 'India'
      ]
    )

    res.json({
      message: 'Business profile updated successfully',
      profile: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE Business Profile Error:', error)

    res.status(500).json({
      message: 'Failed to update business profile'
    })
  }
})


// ==============================
// GET USER CARGO
// ==============================

app.get('/api/cargo', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM cargo
       WHERE user_id = $1
       ORDER BY id DESC`,
      [req.user.id]
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch cargo'
    })
  }
})


// ==============================
// ADD NEW CARGO
// ==============================

app.post('/api/cargo', authMiddleware, async (req, res) => {
  try {
    const {
      product_name,
      category,
      quantity,
      weight,
      dimensions,
      package_type,
      number_of_packages,
      declared_value,
      currency
    } = req.body

    if (
      !product_name ||
      !category ||
      !quantity ||
      !weight ||
      !number_of_packages ||
      !declared_value
    ) {
      return res.status(400).json({
        message: 'Required cargo fields are missing'
      })
    }

    const result = await pool.query(
      `INSERT INTO cargo (
        user_id,
        product_name,
        category,
        quantity,
        weight,
        dimensions,
        package_type,
        number_of_packages,
        declared_value,
        currency
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        req.user.id,
        product_name,
        category,
        quantity,
        weight,
        dimensions,
        package_type,
        number_of_packages,
        declared_value,
        currency || 'USD'
      ]
    )

    res.status(201).json({
      message: 'Cargo added successfully',
      cargo: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to add cargo'
    })
  }
})


// ==============================
// DELETE CARGO
// ==============================

app.delete('/api/cargo/:id', authMiddleware, async (req, res) => {
  try {
    const cargoId = req.params.id

    const result = await pool.query(
      `DELETE FROM cargo
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [cargoId, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Cargo not found'
      })
    }

    res.json({
      message: 'Cargo deleted successfully',
      cargo: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete cargo'
    })
  }
})


app.get('/api/admin/shipments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const result = await pool.query(
      `SELECT
        s.id,
        s.shipment_number,
        s.origin,
        s.destination,
        s.shipping_method,
        s.estimated_cost,
        s.currency,
        s.status,
        s.pickup_date,
        s.created_at,

        t.tracking_number,

        c.product_name AS cargo_name,

        bp.business_name,

        u.name AS owner_name,
        u.email AS owner_email,

        p.name AS provider_name

       FROM shipments s

       LEFT JOIN public.tracking t
         ON s.id = t.shipment_id

       LEFT JOIN cargo c
         ON s.cargo_id = c.id

       LEFT JOIN business_profiles bp
         ON s.user_id = bp.user_id

       INNER JOIN users u
         ON s.user_id = u.id

       LEFT JOIN providers p
         ON s.provider_id = p.id

       ORDER BY s.id DESC`
    )

    return res.status(200).json(result.rows)

  } catch (error) {
    console.error('GET ADMIN SHIPMENTS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch admin shipments'
    })
  }
})


app.put('/api/admin/shipments/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const shipmentId = req.params.id
    const { status } = req.body

    const allowedStatuses = [
      'Pending',
      'In Transit',
      'Completed',
      'Cancelled'
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid shipment status'
      })
    }

    const result = await pool.query(
      `UPDATE shipments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [
        status,
        shipmentId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Shipment not found'
      })
    }

    return res.status(200).json({
      message: 'Shipment status updated successfully',
      shipment: result.rows[0]
    })

  } catch (error) {
    console.error(
      'UPDATE ADMIN SHIPMENT STATUS ERROR:',
      error
    )

    return res.status(500).json({
      message: 'Failed to update shipment status'
    })
  }
}) 


// ==============================
// GET USER SHIPMENTS
// WITH PROVIDER + TRACKING DETAILS
// ==============================

app.get('/api/shipments', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        shipments.*,
        providers.name AS provider_name,
        providers.service_type AS provider_service_type,
        tracking.tracking_number
       FROM shipments
       LEFT JOIN providers
         ON shipments.provider_id = providers.id
       LEFT JOIN public.tracking
         ON shipments.id = tracking.shipment_id
       WHERE shipments.user_id = $1
       ORDER BY shipments.id DESC`,
      [req.user.id]
    )

    res.json(result.rows)

  } catch (error) {
    console.error('GET SHIPMENTS ERROR:', error)

    res.status(500).json({
      message: 'Failed to fetch shipments'
    })
  }
})


// ==============================
// CREATE SHIPMENT
// + AUTOMATIC TRACKING
// ==============================

app.post('/api/shipments', authMiddleware, async (req, res) => {
  const client = await pool.connect()

  try {
    const {
      cargo_id,
      origin,
      destination,
      shipping_method,
      provider_id,
      estimated_cost,
      currency,
      pickup_date
    } = req.body

    if (
      !origin ||
      !destination ||
      !shipping_method
    ) {
      return res.status(400).json({
        message: 'Origin, destination and shipping method are required'
      })
    }

    if (provider_id) {
      const providerCheck = await client.query(
        `SELECT id
         FROM providers
         WHERE id = $1
         AND status = 'Active'`,
        [provider_id]
      )

      if (providerCheck.rows.length === 0) {
        return res.status(400).json({
          message: 'Selected logistics provider is not available'
        })
      }
    }

    await client.query('BEGIN')

    const shipmentNumber = `SC-${Date.now()}`

    const shipmentResult = await client.query(
      `INSERT INTO shipments (
        user_id,
        cargo_id,
        shipment_number,
        origin,
        destination,
        shipping_method,
        provider_id,
        estimated_cost,
        currency,
        pickup_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        req.user.id,
        cargo_id || null,
        shipmentNumber,
        origin,
        destination,
        shipping_method,
        provider_id || null,
        estimated_cost || 0,
        currency || 'USD',
        pickup_date || null
      ]
    )

    const shipment = shipmentResult.rows[0]

    const trackingNumber = `TRK-${Date.now()}`

    const trackingResult = await client.query(
      `INSERT INTO public.tracking (
        shipment_id,
        tracking_number,
        current_location,
        status,
        estimated_delivery
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        shipment.id,
        trackingNumber,
        origin,
        'Pending',
        null
      ]
    )

    const tracking = trackingResult.rows[0]

    await client.query('COMMIT')

    res.status(201).json({
      message: 'Shipment and tracking created successfully',
      shipment,
      tracking
    })

  } catch (error) {

    await client.query('ROLLBACK')

    console.error('CREATE SHIPMENT ERROR:', error)

    res.status(500).json({
      message: 'Failed to create shipment and tracking'
    })

  } finally {
    client.release()
  }
})


// ==============================
// UPDATE SHIPMENT STATUS
// ==============================

app.put('/api/shipments/:id/status', authMiddleware, async (req, res) => {
  try {
    const shipmentId = req.params.id
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        message: 'Status is required'
      })
    }

    const result = await pool.query(
      `UPDATE shipments
       SET status = $1
       WHERE id = $2
       AND user_id = $3
       RETURNING *`,
      [
        status,
        shipmentId,
        req.user.id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Shipment not found'
      })
    }

    res.json({
      message: 'Shipment status updated successfully',
      shipment: result.rows[0]
    })

  } catch (error) {

    console.error('UPDATE SHIPMENT STATUS ERROR:', error)

    res.status(500).json({
      message: 'Failed to update shipment status'
    })
  }
})


// ==============================
// DELETE SHIPMENT
// ==============================

app.delete('/api/shipments/:id', authMiddleware, async (req, res) => {
  try {
    const shipmentId = req.params.id

    const result = await pool.query(
      `DELETE FROM shipments
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [
        shipmentId,
        req.user.id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Shipment not found'
      })
    }

    res.json({
      message: 'Shipment deleted successfully',
      shipment: result.rows[0]
    })

  } catch (error) {

    console.error('DELETE SHIPMENT ERROR:', error)

    res.status(500).json({
      message: 'Failed to delete shipment'
    })
  }
})


// ==============================
// GET ACTIVE PROVIDERS
// ==============================

app.get('/api/providers', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM providers
       WHERE status = 'Active'
       ORDER BY id ASC`
    )

    res.json(result.rows)

  } catch (error) {

    console.error('GET PROVIDERS ERROR:', error)

    res.status(500).json({
      message: 'Failed to fetch providers'
    })
  }
})


// ==============================
// ADD PROVIDER
// ==============================

app.post('/api/providers', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      service_type,
      contact_email,
      contact_phone,
      origin_location,
      service_area
    } = req.body

    if (!name || !service_type) {
      return res.status(400).json({
        message: 'Provider name and service type are required'
      })
    }

    const result = await pool.query(
      `INSERT INTO providers (
        name,
        service_type,
        contact_email,
        contact_phone,
        origin_location,
        service_area
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        name,
        service_type,
        contact_email || null,
        contact_phone || null,
        origin_location || null,
        service_area || null
      ]
    )

    res.status(201).json({
      message: 'Provider added successfully',
      provider: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to add provider'
    })
  }
})


// ==============================
// UPDATE PROVIDER
// ==============================

app.put('/api/providers/:id', authMiddleware, async (req, res) => {
  try {
    const providerId = req.params.id

    const {
      name,
      service_type,
      contact_email,
      contact_phone,
      origin_location,
      service_area,
      status
    } = req.body

    const result = await pool.query(
      `UPDATE providers
       SET
         name = COALESCE($1, name),
         service_type = COALESCE($2, service_type),
         contact_email = COALESCE($3, contact_email),
         contact_phone = COALESCE($4, contact_phone),
         origin_location = COALESCE($5, origin_location),
         service_area = COALESCE($6, service_area),
         status = COALESCE($7, status)
       WHERE id = $8
       RETURNING *`,
      [
        name,
        service_type,
        contact_email,
        contact_phone,
        origin_location,
        service_area,
        status,
        providerId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Provider not found'
      })
    }

    res.json({
      message: 'Provider updated successfully',
      provider: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update provider'
    })
  }
})


// ==============================
// DELETE PROVIDER
// ==============================

app.delete('/api/providers/:id', authMiddleware, async (req, res) => {
  try {
    const providerId = req.params.id

    const result = await pool.query(
      `DELETE FROM providers
       WHERE id = $1
       RETURNING *`,
      [providerId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Provider not found'
      })
    }

    res.json({
      message: 'Provider deleted successfully',
      provider: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete provider'
    })
  }
})


// ==============================
// COST ESTIMATOR
// ==============================

app.post('/api/cost-estimate', authMiddleware, async (req, res) => {
  try {
    const {
      weight,
      shipping_method,
      origin,
      destination
    } = req.body

    if (!weight || !shipping_method || !origin || !destination) {
      return res.status(400).json({
        message: 'Weight, shipping method, origin and destination are required'
      })
    }

    const weightValue = Number(weight)

    if (weightValue <= 0) {
      return res.status(400).json({
        message: 'Weight must be greater than 0'
      })
    }

    let ratePerKg = 0

    if (shipping_method === 'Air') {
      ratePerKg = 8
    } else if (shipping_method === 'Sea') {
      ratePerKg = 3
    } else if (shipping_method === 'Road') {
      ratePerKg = 5
    } else {
      return res.status(400).json({
        message: 'Invalid shipping method'
      })
    }

    const baseCost = weightValue * ratePerKg

    let locationCharge = 0

    if (
      origin.toLowerCase().includes('india') &&
      !destination.toLowerCase().includes('india')
    ) {
      locationCharge = 100
    } else {
      locationCharge = 50
    }

    const estimatedCost = baseCost + locationCharge

    res.json({
      message: 'Cost estimated successfully',
      estimate: {
        weight: weightValue,
        shipping_method,
        origin,
        destination,
        rate_per_kg: ratePerKg,
        base_cost: baseCost,
        location_charge: locationCharge,
        estimated_cost: estimatedCost,
        currency: 'USD'
      }
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to calculate shipping cost'
    })
  }
})


// ==============================
// DOCUMENTS
// ==============================

// GET DOCUMENTS

app.get('/api/documents', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        documents.*,
        shipments.shipment_number
       FROM documents
       LEFT JOIN shipments
         ON documents.shipment_id = shipments.id
       WHERE documents.user_id = $1
       ORDER BY documents.id DESC`,
      [req.user.id]
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch documents'
    })
  }
})


// ADD DOCUMENT

app.post('/api/documents', authMiddleware, async (req, res) => {
  try {
    const {
      shipment_id,
      document_name,
      document_type,
      file_path
    } = req.body

    if (!document_name || !document_type) {
      return res.status(400).json({
        message: 'Document name and document type are required'
      })
    }

    if (shipment_id) {
      const shipmentCheck = await pool.query(
        `SELECT id
         FROM shipments
         WHERE id = $1
         AND user_id = $2`,
        [shipment_id, req.user.id]
      )

      if (shipmentCheck.rows.length === 0) {
        return res.status(400).json({
          message: 'Invalid shipment selected'
        })
      }
    }

    const result = await pool.query(
      `INSERT INTO documents (
        user_id,
        shipment_id,
        document_name,
        document_type,
        file_path
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        req.user.id,
        shipment_id || null,
        document_name,
        document_type,
        file_path || null
      ]
    )

    res.status(201).json({
      message: 'Document added successfully',
      document: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to add document'
    })
  }
})


// UPDATE DOCUMENT STATUS

app.put('/api/documents/:id/status', authMiddleware, async (req, res) => {
  try {
    const documentId = req.params.id
    const { status } = req.body

    const allowedStatuses = [
      'Pending',
      'Approved',
      'Rejected'
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid document status'
      })
    }

    const result = await pool.query(
      `UPDATE documents
       SET status = $1
       WHERE id = $2
       AND user_id = $3
       RETURNING *`,
      [
        status,
        documentId,
        req.user.id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Document not found'
      })
    }

    res.json({
      message: 'Document status updated successfully',
      document: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update document status'
    })
  }
})


// DELETE DOCUMENT

app.delete('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    const documentId = req.params.id

    const result = await pool.query(
      `DELETE FROM documents
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [
        documentId,
        req.user.id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Document not found'
      })
    }

    res.json({
      message: 'Document deleted successfully',
      document: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete document'
    })
  }
})


// ==============================
// PAYMENTS
// ==============================

// GET PAYMENTS

app.get('/api/payments', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        payments.*,
        shipments.shipment_number
       FROM payments
       LEFT JOIN shipments
         ON payments.shipment_id = shipments.id
       WHERE payments.user_id = $1
       ORDER BY payments.id DESC`,
      [req.user.id]
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch payments'
    })
  }
})


// CREATE PAYMENT

app.post('/api/payments', authMiddleware, async (req, res) => {
  const client = await pool.connect()

  try {
    const {
      shipment_id,
      amount,
      currency,
      payment_method
    } = req.body

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: 'Valid payment amount is required'
      })
    }

    if (shipment_id) {
      const shipmentCheck = await client.query(
        `SELECT id
         FROM shipments
         WHERE id = $1
         AND user_id = $2`,
        [
          shipment_id,
          req.user.id
        ]
      )

      if (shipmentCheck.rows.length === 0) {
        return res.status(400).json({
          message: 'Invalid shipment selected'
        })
      }
    }

    await client.query('BEGIN')

    const paymentReference = `PAY-${Date.now()}`

    const paymentResult = await client.query(
      `INSERT INTO payments (
        user_id,
        shipment_id,
        payment_reference,
        amount,
        currency,
        payment_method,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        req.user.id,
        shipment_id || null,
        paymentReference,
        Number(amount),
        currency || 'USD',
        payment_method || 'Online',
        'Completed'
      ]
    )

    const payment = paymentResult.rows[0]

    const invoiceNumber = `INV-${Date.now()}`

    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        user_id,
        payment_id,
        shipment_id,
        invoice_number,
        amount,
        currency,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        req.user.id,
        payment.id,
        shipment_id || null,
        invoiceNumber,
        Number(amount),
        currency || 'USD',
        'Generated'
      ]
    )

    const invoice = invoiceResult.rows[0]

    await client.query('COMMIT')

    res.status(201).json({
      message: 'Payment completed and invoice generated successfully',
      payment,
      invoice
    })

  } catch (error) {
    await client.query('ROLLBACK')

    console.error(error)

    res.status(500).json({
      message: 'Failed to create payment and invoice'
    })

  } finally {
    client.release()
  }
})


// ==============================
// TRACKING
// ==============================

// GET TRACKING

app.get('/api/tracking', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        t.*,
        s.shipment_number,
        s.origin,
        s.destination,
        s.shipping_method,
        p.name AS provider_name
       FROM public.tracking t
       INNER JOIN public.shipments s
         ON t.shipment_id = s.id
       LEFT JOIN public.providers p
         ON s.provider_id = p.id
       WHERE s.user_id = $1
       ORDER BY t.id DESC`,
      [req.user.id]
    )

    res.json(result.rows)

  } catch (error) {
    console.error('GET Tracking Error:', error)

    res.status(500).json({
      message: 'Failed to fetch tracking information'
    })
  }
})


// CREATE TRACKING
// Normal shipment creation already creates tracking automatically.

app.post('/api/tracking', authMiddleware, async (req, res) => {
  try {
    const {
      shipment_id,
      current_location,
      status,
      estimated_delivery
    } = req.body

    if (!shipment_id) {
      return res.status(400).json({
        message: 'Shipment is required'
      })
    }

    const shipmentResult = await pool.query(
      `SELECT
        id,
        shipment_number,
        origin
       FROM public.shipments
       WHERE id = $1
       AND user_id = $2`,
      [
        shipment_id,
        req.user.id
      ]
    )

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Shipment not found'
      })
    }

    const existingTracking = await pool.query(
      `SELECT id
       FROM public.tracking
       WHERE shipment_id = $1`,
      [shipment_id]
    )

    if (existingTracking.rows.length > 0) {
      return res.status(409).json({
        message: 'Tracking already exists for this shipment'
      })
    }

    const trackingNumber = `TRK-${Date.now()}`

    const result = await pool.query(
      `INSERT INTO public.tracking (
        shipment_id,
        tracking_number,
        current_location,
        status,
        estimated_delivery
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        shipment_id,
        trackingNumber,
        current_location || shipmentResult.rows[0].origin,
        status || 'Pending',
        estimated_delivery || null
      ]
    )

    res.status(201).json({
      message: 'Tracking created successfully',
      tracking: result.rows[0]
    })

  } catch (error) {
    console.error('CREATE Tracking Error:', error)

    res.status(500).json({
      message: 'Failed to create tracking'
    })
  }
})


// UPDATE TRACKING

app.put('/api/tracking/:id', authMiddleware, async (req, res) => {
  try {
    const trackingId = req.params.id

    const {
      current_location,
      status,
      estimated_delivery
    } = req.body

    const result = await pool.query(
      `UPDATE public.tracking t
       SET
         current_location = COALESCE($1, t.current_location),
         status = COALESCE($2, t.status),
         estimated_delivery = COALESCE($3, t.estimated_delivery),
         last_updated = CURRENT_TIMESTAMP
       FROM public.shipments s
       WHERE t.id = $4
       AND t.shipment_id = s.id
       AND s.user_id = $5
       RETURNING t.*`,
      [
        current_location || null,
        status || null,
        estimated_delivery || null,
        trackingId,
        req.user.id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Tracking record not found'
      })
    }

    res.json({
      message: 'Tracking updated successfully',
      tracking: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE Tracking Error:', error)

    res.status(500).json({
      message: 'Failed to update tracking'
    })
  }
})


// ==============================
// UPDATE PAYMENT STATUS
// ==============================

app.put('/api/payments/:id/status', authMiddleware, async (req, res) => {
  try {
    const paymentId = req.params.id
    const { status } = req.body

    const allowedStatuses = [
      'Pending',
      'Completed',
      'Failed',
      'Refunded'
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid payment status'
      })
    }

    const result = await pool.query(
      `UPDATE payments
       SET status = $1
       WHERE id = $2
       AND user_id = $3
       RETURNING *`,
      [
        status,
        paymentId,
        req.user.id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Payment not found'
      })
    }

    res.json({
      message: 'Payment status updated successfully',
      payment: result.rows[0]
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update payment status'
    })
  }
})


// ==============================
// INVOICES
// ==============================

// GET INVOICES

app.get('/api/invoices', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        invoices.*,
        shipments.shipment_number,
        payments.payment_reference,
        payments.payment_method
       FROM invoices
       LEFT JOIN shipments
         ON invoices.shipment_id = shipments.id
       LEFT JOIN payments
         ON invoices.payment_id = payments.id
       WHERE invoices.user_id = $1
       ORDER BY invoices.id DESC`,
      [req.user.id]
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch invoices'
    })
  }
})

app.get('/api/admin/documents', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const result = await pool.query(
      `SELECT
        d.id,
        d.document_name,
        d.document_type,
        d.file_path,
        d.status,
        d.uploaded_at,

        s.shipment_number,
        s.origin,
        s.destination,

        u.name AS owner_name,
        u.email AS owner_email,

        bp.business_name

       FROM documents d

       LEFT JOIN shipments s
         ON d.shipment_id = s.id

       INNER JOIN users u
         ON d.user_id = u.id

       LEFT JOIN business_profiles bp
         ON d.user_id = bp.user_id

       ORDER BY d.id DESC`
    )

    return res.status(200).json(result.rows)

  } catch (error) {
    console.error('GET ADMIN DOCUMENTS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch admin documents'
    })
  }
})


app.put('/api/admin/documents/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const documentId = req.params.id
    const { status } = req.body

    const allowedStatuses = [
      'Pending',
      'Approved',
      'Rejected'
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid document status'
      })
    }

    const result = await pool.query(
      `UPDATE documents
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [
        status,
        documentId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Document not found'
      })
    }

    return res.status(200).json({
      message: 'Document status updated successfully',
      document: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE ADMIN DOCUMENT STATUS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to update document status'
    })
  }
})

app.get('/api/admin/payments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const result = await pool.query(
      `SELECT
        p.id,
        p.payment_reference,
        p.amount,
        p.currency,
        p.payment_method,
        p.status,
        p.payment_date,

        s.shipment_number,

        u.name AS owner_name,
        u.email AS owner_email,

        bp.business_name

       FROM payments p

       LEFT JOIN shipments s
         ON p.shipment_id = s.id

       INNER JOIN users u
         ON p.user_id = u.id

       LEFT JOIN business_profiles bp
         ON p.user_id = bp.user_id

       ORDER BY p.id DESC`
    )

    return res.status(200).json(result.rows)

  } catch (error) {
    console.error('GET ADMIN PAYMENTS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch admin payments'
    })
  }
})


app.put('/api/admin/payments/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const paymentId = req.params.id
    const { status } = req.body

    const allowedStatuses = [
      'Pending',
      'Completed',
      'Failed',
      'Refunded'
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid payment status'
      })
    }

    const result = await pool.query(
      `UPDATE payments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [
        status,
        paymentId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Payment not found'
      })
    }

    return res.status(200).json({
      message: 'Payment status updated successfully',
      payment: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE ADMIN PAYMENT STATUS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to update payment status'
    })
  }
})

app.get('/api/admin/providers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const result = await pool.query(
      `SELECT *
       FROM providers
       ORDER BY id DESC`
    )

    res.status(200).json(result.rows)

  } catch (error) {
    console.error('GET ADMIN PROVIDERS ERROR:', error)

    res.status(500).json({
      message: 'Failed to fetch providers'
    })
  }
})


app.post('/api/admin/providers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const {
      name,
      service_type,
      contact_email,
      phone,
      location,
      coverage
    } = req.body

    if (
      !name ||
      !service_type ||
      !contact_email ||
      !phone ||
      !location ||
      !coverage
    ) {
      return res.status(400).json({
        message: 'All provider fields are required'
      })
    }

    const result = await pool.query(
      `INSERT INTO providers (
        name,
        service_type,
        contact_email,
        phone,
        location,
        coverage,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'Active')
      RETURNING *`,
      [
        name,
        service_type,
        contact_email,
        phone,
        location,
        coverage
      ]
    )

    res.status(201).json({
      message: 'Provider created successfully',
      provider: result.rows[0]
    })

  } catch (error) {
    console.error('CREATE ADMIN PROVIDER ERROR:', error)

    res.status(500).json({
      message: 'Failed to create provider'
    })
  }
})


app.put('/api/admin/providers/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const providerId = req.params.id

    const {
      name,
      service_type,
      contact_email,
      phone,
      location,
      coverage,
      status
    } = req.body

    if (
      !name ||
      !service_type ||
      !contact_email ||
      !phone ||
      !location ||
      !coverage
    ) {
      return res.status(400).json({
        message: 'All provider fields are required'
      })
    }

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid provider status'
      })
    }

    const result = await pool.query(
      `UPDATE providers
       SET
         name = $1,
         service_type = $2,
         contact_email = $3,
         phone = $4,
         location = $5,
         coverage = $6,
         status = $7
       WHERE id = $8
       RETURNING *`,
      [
        name,
        service_type,
        contact_email,
        phone,
        location,
        coverage,
        status,
        providerId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Provider not found'
      })
    }

    res.status(200).json({
      message: 'Provider updated successfully',
      provider: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE ADMIN PROVIDER ERROR:', error)

    res.status(500).json({
      message: 'Failed to update provider'
    })
  }
})


app.delete('/api/admin/providers/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const providerId = req.params.id

    const result = await pool.query(
      `DELETE FROM providers
       WHERE id = $1
       RETURNING *`,
      [providerId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Provider not found'
      })
    }

    res.status(200).json({
      message: 'Provider deleted successfully',
      provider: result.rows[0]
    })

  } catch (error) {
    console.error('DELETE ADMIN PROVIDER ERROR:', error)

    res.status(500).json({
      message: 'Failed to delete provider'
    })
  }
})


app.get('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const result = await pool.query(
      `SELECT
        id,
        email_notifications,
        shipment_updates,
        payment_notifications,
        document_notifications,
        language,
        currency
       FROM user_settings
       WHERE user_id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      const newSettings = await pool.query(
        `INSERT INTO user_settings (
          user_id,
          email_notifications,
          shipment_updates,
          payment_notifications,
          document_notifications,
          language,
          currency
        )
        VALUES ($1, TRUE, TRUE, TRUE, TRUE, 'English', 'USD')
        RETURNING
          id,
          email_notifications,
          shipment_updates,
          payment_notifications,
          document_notifications,
          language,
          currency`,
        [req.user.id]
      )

      return res.status(200).json(newSettings.rows[0])
    }

    return res.status(200).json(result.rows[0])

  } catch (error) {
    console.error('GET ADMIN SETTINGS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch admin settings'
    })
  }
})


app.put('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({
        message: 'Administrator access required'
      })
    }

    const {
      email_notifications,
      shipment_updates,
      payment_notifications,
      document_notifications,
      language,
      currency
    } = req.body

    const result = await pool.query(
      `INSERT INTO user_settings (
        user_id,
        email_notifications,
        shipment_updates,
        payment_notifications,
        document_notifications,
        language,
        currency,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)

      ON CONFLICT (user_id)
      DO UPDATE SET
        email_notifications = EXCLUDED.email_notifications,
        shipment_updates = EXCLUDED.shipment_updates,
        payment_notifications = EXCLUDED.payment_notifications,
        document_notifications = EXCLUDED.document_notifications,
        language = EXCLUDED.language,
        currency = EXCLUDED.currency,
        updated_at = CURRENT_TIMESTAMP

      RETURNING
        id,
        email_notifications,
        shipment_updates,
        payment_notifications,
        document_notifications,
        language,
        currency`,
      [
        req.user.id,
        email_notifications ?? true,
        shipment_updates ?? true,
        payment_notifications ?? true,
        document_notifications ?? true,
        language || 'English',
        currency || 'USD'
      ]
    )

    return res.status(200).json({
      message: 'Admin settings updated successfully',
      settings: result.rows[0]
    })

  } catch (error) {
    console.error('UPDATE ADMIN SETTINGS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to update admin settings'
    })
  }
})

// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
  console.log(
    `Smart Cargo backend running on https://smart-cargo.onrender.com:${PORT}`
  )
})