const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const pool = require('./db')
const authMiddleware = require('./middleware/authMiddleware')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET


// =====================================================
// BASIC ROUTES
// =====================================================

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Cargo Backend is running'
  })
})


app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart Cargo API is healthy'
  })
})


// =====================================================
// REGISTER
// =====================================================

app.post('/api/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'Business User'
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      })
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users
       (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, status, created_at`,
      [
        name,
        email,
        hashedPassword,
        role
      ]
    )

    const user = result.rows[0]

    await pool.query(
      `INSERT INTO user_settings (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    )

    res.status(201).json({
      message: 'Registration successful',
      user
    })

  } catch (error) {
    console.error('REGISTER ERROR:', error)

    res.status(500).json({
      message: 'Registration failed'
    })
  }
})


// =====================================================
// LOGIN
// =====================================================

app.post('/api/login', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE email = $1`,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const user = result.rows[0]

    if (user.status !== 'Active') {
      return res.status(403).json({
        message: 'Your account is inactive'
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
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
    console.error('LOGIN ERROR:', error)

    res.status(500).json({
      message: 'Login failed'
    })
  }
})


// =====================================================
// CURRENT USER
// =====================================================

app.get(
  '/api/me',
  authMiddleware,
  async (req, res) => {
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

      res.json(result.rows[0])

    } catch (error) {
      console.error('ME ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch user'
      })
    }
  }
)


// =====================================================
// USER SETTINGS
// =====================================================

app.get(
  '/api/settings',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT *
         FROM user_settings
         WHERE user_id = $1`,
        [req.user.id]
      )

      if (result.rows.length === 0) {
        const created = await pool.query(
          `INSERT INTO user_settings (user_id)
           VALUES ($1)
           RETURNING *`,
          [req.user.id]
        )

        return res.json(created.rows[0])
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('GET SETTINGS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch settings'
      })
    }
  }
)


app.put(
  '/api/settings',
  authMiddleware,
  async (req, res) => {
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
        `INSERT INTO user_settings
        (
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

        RETURNING *`,
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

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE SETTINGS ERROR:', error)

      res.status(500).json({
        message: 'Failed to update settings'
      })
    }
  }
)


// =====================================================
// BUSINESS PROFILE
// =====================================================

app.get(
  '/api/business-profile',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT *
         FROM business_profiles
         WHERE user_id = $1`,
        [req.user.id]
      )

      if (result.rows.length === 0) {
        return res.json({
          user_id: req.user.id,
          business_name: '',
          phone: '',
          business_type: '',
          registration_number: '',
          address: '',
          city: '',
          country: 'India'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('GET BUSINESS PROFILE ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch business profile'
      })
    }
  }
)


app.put(
  '/api/business-profile',
  authMiddleware,
  async (req, res) => {
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
        `INSERT INTO business_profiles
        (
          user_id,
          business_name,
          phone,
          business_type,
          registration_number,
          address,
          city,
          country,
          updated_at
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)

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
          business_name,
          phone,
          business_type,
          registration_number,
          address,
          city,
          country || 'India'
        ]
      )

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE BUSINESS PROFILE ERROR:', error)

      res.status(500).json({
        message: 'Failed to update business profile'
      })
    }
  }
)


// =====================================================
// CARGO
// =====================================================

app.get(
  '/api/cargo',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT *
         FROM cargo
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.id]
      )

      res.json(result.rows)

    } catch (error) {
      console.error('GET CARGO ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch cargo'
      })
    }
  }
)


app.post(
  '/api/cargo',
  authMiddleware,
  async (req, res) => {
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

      const result = await pool.query(
        `INSERT INTO cargo
        (
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
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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

      res.status(201).json(result.rows[0])

    } catch (error) {
      console.error('CREATE CARGO ERROR:', error)

      res.status(500).json({
        message: 'Failed to create cargo'
      })
    }
  }
)


app.delete(
  '/api/cargo/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `DELETE FROM cargo
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Cargo not found'
        })
      }

      res.json({
        message: 'Cargo deleted successfully'
      })

    } catch (error) {
      console.error('DELETE CARGO ERROR:', error)

      res.status(500).json({
        message: 'Failed to delete cargo'
      })
    }
  }
)


// =====================================================
// SHIPMENTS - BUSINESS USER
// =====================================================

app.get(
  '/api/shipments',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          s.*,
          c.product_name,
          c.category
         FROM shipments s
         LEFT JOIN cargo c
           ON s.cargo_id = c.id
         WHERE s.user_id = $1
         ORDER BY s.created_at DESC`,
        [req.user.id]
      )

      res.json(result.rows)

    } catch (error) {
      console.error('GET SHIPMENTS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch shipments'
      })
    }
  }
)


app.post(
  '/api/shipments',
  authMiddleware,
  async (req, res) => {
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

      const shipmentNumber =
        'SC-' +
        Date.now()

      const result = await pool.query(
        `INSERT INTO shipments
        (
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
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
          req.user.id,
          cargo_id || null,
          shipmentNumber,
          origin,
          destination,
          shipping_method,
          provider_id || null,
          estimated_cost || null,
          currency || 'USD',
          pickup_date || null
        ]
      )

      res.status(201).json(result.rows[0])

    } catch (error) {
      console.error('CREATE SHIPMENT ERROR:', error)

      res.status(500).json({
        message: 'Failed to create shipment'
      })
    }
  }
)


app.put(
  '/api/shipments/:id/status',
  authMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body

      const result = await pool.query(
        `UPDATE shipments
         SET status = $1
         WHERE id = $2
         AND user_id = $3
         RETURNING *`,
        [
          status,
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Shipment not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE SHIPMENT STATUS ERROR:', error)

      res.status(500).json({
        message: 'Failed to update shipment'
      })
    }
  }
)


app.delete(
  '/api/shipments/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `DELETE FROM shipments
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Shipment not found'
        })
      }

      res.json({
        message: 'Shipment deleted successfully'
      })

    } catch (error) {
      console.error('DELETE SHIPMENT ERROR:', error)

      res.status(500).json({
        message: 'Failed to delete shipment'
      })
    }
  }
)


// =====================================================
// PROVIDERS - BUSINESS USER
// =====================================================

app.get(
  '/api/providers',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT *
         FROM providers
         WHERE status = 'Active'
         ORDER BY id`
      )

      res.json(result.rows)

    } catch (error) {
      console.error('GET PROVIDERS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch providers'
      })
    }
  }
)


// =====================================================
// COST ESTIMATOR
// =====================================================

app.post(
  '/api/cost-estimate',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        weight,
        shipping_method
      } = req.body

      const weightValue = Number(weight)

      if (!weightValue || weightValue <= 0) {
        return res.status(400).json({
          message: 'Valid weight is required'
        })
      }

      let rate = 5

      if (shipping_method === 'Air') {
        rate = 12
      } else if (shipping_method === 'Sea') {
        rate = 4
      } else if (shipping_method === 'Road') {
        rate = 6
      }

      const estimatedCost =
        weightValue * rate

      res.json({
        weight: weightValue,
        shipping_method,
        rate,
        estimated_cost: estimatedCost,
        currency: 'USD'
      })

    } catch (error) {
      console.error('COST ESTIMATE ERROR:', error)

      res.status(500).json({
        message: 'Failed to calculate cost'
      })
    }
  }
)


// =====================================================
// DOCUMENTS - BUSINESS USER
// =====================================================

app.get(
  '/api/documents',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          d.*,
          s.shipment_number
         FROM documents d
         LEFT JOIN shipments s
           ON d.shipment_id = s.id
         WHERE d.user_id = $1
         ORDER BY d.uploaded_at DESC`,
        [req.user.id]
      )

      res.json(result.rows)

    } catch (error) {
      console.error('GET DOCUMENTS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch documents'
      })
    }
  }
)


app.post(
  '/api/documents',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        shipment_id,
        document_name,
        document_type,
        file_path
      } = req.body

      const result = await pool.query(
        `INSERT INTO documents
        (
          user_id,
          shipment_id,
          document_name,
          document_type,
          file_path
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [
          req.user.id,
          shipment_id || null,
          document_name,
          document_type,
          file_path || null
        ]
      )

      res.status(201).json(result.rows[0])

    } catch (error) {
      console.error('CREATE DOCUMENT ERROR:', error)

      res.status(500).json({
        message: 'Failed to create document'
      })
    }
  }
)


app.put(
  '/api/documents/:id/status',
  authMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body

      const result = await pool.query(
        `UPDATE documents
         SET status = $1
         WHERE id = $2
         AND user_id = $3
         RETURNING *`,
        [
          status,
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Document not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE DOCUMENT ERROR:', error)

      res.status(500).json({
        message: 'Failed to update document'
      })
    }
  }
)


app.delete(
  '/api/documents/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `DELETE FROM documents
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Document not found'
        })
      }

      res.json({
        message: 'Document deleted successfully'
      })

    } catch (error) {
      console.error('DELETE DOCUMENT ERROR:', error)

      res.status(500).json({
        message: 'Failed to delete document'
      })
    }
  }
)


// =====================================================
// PAYMENTS
// =====================================================

app.get(
  '/api/payments',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          p.*,
          s.shipment_number
         FROM payments p
         LEFT JOIN shipments s
           ON p.shipment_id = s.id
         WHERE p.user_id = $1
         ORDER BY p.payment_date DESC`,
        [req.user.id]
      )

      res.json(result.rows)

    } catch (error) {
      console.error('GET PAYMENTS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch payments'
      })
    }
  }
)


app.post(
  '/api/payments',
  authMiddleware,
  async (req, res) => {

    const client = await pool.connect()

    try {

      const {
        shipment_id,
        amount,
        currency,
        payment_method
      } = req.body

      await client.query('BEGIN')

      const paymentReference =
        'PAY-' + Date.now()

      const paymentResult = await client.query(
        `INSERT INTO payments
        (
          user_id,
          shipment_id,
          payment_reference,
          amount,
          currency,
          payment_method,
          status
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,'Completed')
        RETURNING *`,
        [
          req.user.id,
          shipment_id || null,
          paymentReference,
          amount,
          currency || 'USD',
          payment_method || 'Online'
        ]
      )

      const payment =
        paymentResult.rows[0]

      const invoiceNumber =
        'INV-' + Date.now()

      await client.query(
        `INSERT INTO invoices
        (
          user_id,
          payment_id,
          shipment_id,
          invoice_number,
          amount,
          currency,
          status
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,'Generated')`,
        [
          req.user.id,
          payment.id,
          shipment_id || null,
          invoiceNumber,
          amount,
          currency || 'USD'
        ]
      )

      await client.query('COMMIT')

      res.status(201).json({
        message: 'Payment completed successfully',
        payment
      })

    } catch (error) {

      await client.query('ROLLBACK')

      console.error('PAYMENT ERROR:', error)

      res.status(500).json({
        message: 'Payment failed'
      })

    } finally {
      client.release()
    }
  }
)


app.put(
  '/api/payments/:id/status',
  authMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body

      const result = await pool.query(
        `UPDATE payments
         SET status = $1
         WHERE id = $2
         AND user_id = $3
         RETURNING *`,
        [
          status,
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Payment not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE PAYMENT ERROR:', error)

      res.status(500).json({
        message: 'Failed to update payment'
      })
    }
  }
)


// =====================================================
// INVOICES
// =====================================================

app.get(
  '/api/invoices',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          i.*,
          s.shipment_number,
          p.payment_reference
         FROM invoices i
         LEFT JOIN shipments s
           ON i.shipment_id = s.id
         LEFT JOIN payments p
           ON i.payment_id = p.id
         WHERE i.user_id = $1
         ORDER BY i.invoice_date DESC`,
        [req.user.id]
      )

      res.json(result.rows)

    } catch (error) {
      console.error('GET INVOICES ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch invoices'
      })
    }
  }
)


// =====================================================
// TRACKING
// =====================================================

app.get(
  '/api/tracking',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          t.*,
          s.shipment_number,
          s.origin,
          s.destination
         FROM tracking t
         INNER JOIN shipments s
           ON t.shipment_id = s.id
         WHERE s.user_id = $1
         ORDER BY t.last_updated DESC`,
        [req.user.id]
      )

      res.json(result.rows)

    } catch (error) {
      console.error('GET TRACKING ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch tracking'
      })
    }
  }
)


app.post(
  '/api/tracking',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        shipment_id,
        tracking_number,
        current_location,
        status,
        estimated_delivery
      } = req.body

      const shipment = await pool.query(
        `SELECT id
         FROM shipments
         WHERE id = $1
         AND user_id = $2`,
        [
          shipment_id,
          req.user.id
        ]
      )

      if (shipment.rows.length === 0) {
        return res.status(404).json({
          message: 'Shipment not found'
        })
      }

      const result = await pool.query(
        `INSERT INTO tracking
        (
          shipment_id,
          tracking_number,
          current_location,
          status,
          estimated_delivery
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [
          shipment_id,
          tracking_number,
          current_location,
          status || 'Pending',
          estimated_delivery || null
        ]
      )

      res.status(201).json(result.rows[0])

    } catch (error) {
      console.error('CREATE TRACKING ERROR:', error)

      res.status(500).json({
        message: 'Failed to create tracking'
      })
    }
  }
)


app.put(
  '/api/tracking/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        current_location,
        status,
        estimated_delivery
      } = req.body

      const result = await pool.query(
        `UPDATE tracking t
         SET
           current_location = $1,
           status = $2,
           estimated_delivery = $3,
           last_updated = CURRENT_TIMESTAMP

         FROM shipments s

         WHERE t.id = $4
         AND t.shipment_id = s.id
         AND s.user_id = $5

         RETURNING t.*`,
        [
          current_location,
          status,
          estimated_delivery || null,
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Tracking record not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE TRACKING ERROR:', error)

      res.status(500).json({
        message: 'Failed to update tracking'
      })
    }
  }
)


// =====================================================
// ADMIN - USERS
// =====================================================

app.get(
  '/api/users',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `SELECT
          id,
          name,
          email,
          role,
          status,
          created_at
         FROM users
         ORDER BY created_at DESC`
      )

      res.json(result.rows)

    } catch (error) {
      console.error('ADMIN USERS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch users'
      })
    }
  }
)


app.put(
  '/api/users/:id/status',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const { status } = req.body

      const result = await pool.query(
        `UPDATE users
         SET status = $1
         WHERE id = $2
         RETURNING id, name, email, role, status`,
        [
          status,
          req.params.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'User not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE USER STATUS ERROR:', error)

      res.status(500).json({
        message: 'Failed to update user status'
      })
    }
  }
)


// =====================================================
// ADMIN - BUSINESSES
// =====================================================

app.get(
  '/api/admin/businesses',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `SELECT
          bp.*,
          u.name AS user_name,
          u.email AS user_email,
          u.status AS user_status

         FROM business_profiles bp

         INNER JOIN users u
           ON bp.user_id = u.id

         ORDER BY bp.created_at DESC`
      )

      res.json(result.rows)

    } catch (error) {
      console.error('ADMIN BUSINESSES ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch businesses'
      })
    }
  }
)


// =====================================================
// ADMIN - SHIPMENTS
// =====================================================

app.get(
  '/api/admin/shipments',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `SELECT
          s.*,
          s.provider_id,
          u.name AS owner_name,
          u.email AS owner_email,
          p.name AS provider_name

         FROM shipments s

         INNER JOIN users u
           ON s.user_id = u.id

         LEFT JOIN providers p
           ON s.provider_id = p.id

         ORDER BY s.created_at DESC`
      )

      res.json(result.rows)

    } catch (error) {
      console.error('ADMIN SHIPMENTS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch shipments'
      })
    }
  }
)


app.put(
  '/api/admin/shipments/:id/status',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const { status } = req.body

      const result = await pool.query(
        `UPDATE shipments
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [
          status,
          req.params.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Shipment not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('ADMIN SHIPMENT STATUS ERROR:', error)

      res.status(500).json({
        message: 'Failed to update shipment status'
      })
    }
  }
)


app.put(
  '/api/admin/shipments/:id/provider',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const {
        provider_id
      } = req.body

      const result = await pool.query(
        `UPDATE shipments
         SET provider_id = $1
         WHERE id = $2
         RETURNING *`,
        [
          provider_id || null,
          req.params.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Shipment not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('ASSIGN PROVIDER ERROR:', error)

      res.status(500).json({
        message: 'Failed to assign provider'
      })
    }
  }
)


// =====================================================
// ADMIN - DOCUMENTS
// =====================================================

app.get(
  '/api/admin/documents',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `SELECT
          d.*,
          u.name AS owner_name,
          u.email AS owner_email,
          s.shipment_number

         FROM documents d

         INNER JOIN users u
           ON d.user_id = u.id

         LEFT JOIN shipments s
           ON d.shipment_id = s.id

         ORDER BY d.uploaded_at DESC`
      )

      res.json(result.rows)

    } catch (error) {
      console.error('ADMIN DOCUMENTS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch documents'
      })
    }
  }
)


app.put(
  '/api/admin/documents/:id/status',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const { status } = req.body

      const result = await pool.query(
        `UPDATE documents
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [
          status,
          req.params.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Document not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('ADMIN DOCUMENT STATUS ERROR:', error)

      res.status(500).json({
        message: 'Failed to update document'
      })
    }
  }
)


// =====================================================
// ADMIN - PAYMENTS
// =====================================================

app.get(
  '/api/admin/payments',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `SELECT
          p.*,
          u.name AS owner_name,
          u.email AS owner_email,
          s.shipment_number

         FROM payments p

         INNER JOIN users u
           ON p.user_id = u.id

         LEFT JOIN shipments s
           ON p.shipment_id = s.id

         ORDER BY p.payment_date DESC`
      )

      res.json(result.rows)

    } catch (error) {
      console.error('ADMIN PAYMENTS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch payments'
      })
    }
  }
)


app.put(
  '/api/admin/payments/:id/status',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const { status } = req.body

      const result = await pool.query(
        `UPDATE payments
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [
          status,
          req.params.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Payment not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('ADMIN PAYMENT STATUS ERROR:', error)

      res.status(500).json({
        message: 'Failed to update payment'
      })
    }
  }
)


// =====================================================
// ADMIN - PROVIDERS
// =====================================================

app.get(
  '/api/admin/providers',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `SELECT *
         FROM providers
         ORDER BY id`
      )

      res.json(result.rows)

    } catch (error) {
      console.error('ADMIN PROVIDERS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch providers'
      })
    }
  }
)


app.post(
  '/api/admin/providers',
  authMiddleware,
  async (req, res) => {
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
        coverage,
        status
      } = req.body

      const result = await pool.query(
        `INSERT INTO providers
        (
          name,
          service_type,
          contact_email,
          phone,
          location,
          coverage,
          status
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [
          name,
          service_type,
          contact_email,
          phone,
          location,
          coverage,
          status || 'Active'
        ]
      )

      res.status(201).json(result.rows[0])

    } catch (error) {
      console.error('CREATE PROVIDER ERROR:', error)

      res.status(500).json({
        message: 'Failed to create provider'
      })
    }
  }
)


app.put(
  '/api/admin/providers/:id',
  authMiddleware,
  async (req, res) => {
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
        coverage,
        status
      } = req.body

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
          req.params.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Provider not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE PROVIDER ERROR:', error)

      res.status(500).json({
        message: 'Failed to update provider'
      })
    }
  }
)


app.delete(
  '/api/admin/providers/:id',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `DELETE FROM providers
         WHERE id = $1
         RETURNING *`,
        [req.params.id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Provider not found'
        })
      }

      res.json({
        message: 'Provider deleted successfully'
      })

    } catch (error) {
      console.error('DELETE PROVIDER ERROR:', error)

      res.status(500).json({
        message: 'Failed to delete provider'
      })
    }
  }
)


// =====================================================
// ADMIN SETTINGS
// =====================================================

app.get(
  '/api/admin/settings',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Administrator') {
        return res.status(403).json({
          message: 'Administrator access required'
        })
      }

      const result = await pool.query(
        `SELECT *
         FROM user_settings
         WHERE user_id = $1`,
        [req.user.id]
      )

      if (result.rows.length === 0) {
        const created = await pool.query(
          `INSERT INTO user_settings (user_id)
           VALUES ($1)
           RETURNING *`,
          [req.user.id]
        )

        return res.json(created.rows[0])
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error('ADMIN SETTINGS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch admin settings'
      })
    }
  }
)


app.put(
  '/api/admin/settings',
  authMiddleware,
  async (req, res) => {
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
        `INSERT INTO user_settings
        (
          user_id,
          email_notifications,
          shipment_updates,
          payment_notifications,
          document_notifications,
          language,
          currency,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)

        ON CONFLICT (user_id)
        DO UPDATE SET
          email_notifications = EXCLUDED.email_notifications,
          shipment_updates = EXCLUDED.shipment_updates,
          payment_notifications = EXCLUDED.payment_notifications,
          document_notifications = EXCLUDED.document_notifications,
          language = EXCLUDED.language,
          currency = EXCLUDED.currency,
          updated_at = CURRENT_TIMESTAMP

        RETURNING *`,
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

      res.json(result.rows[0])

    } catch (error) {
      console.error('UPDATE ADMIN SETTINGS ERROR:', error)

      res.status(500).json({
        message: 'Failed to update admin settings'
      })
    }
  }
)


// =====================================================
// LOGISTICS PROVIDER - ASSIGNED SHIPMENTS
// =====================================================

app.get(
  '/api/provider/shipments',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Logistics Provider') {
        return res.status(403).json({
          message: 'Logistics Provider access required'
        })
      }

      const result = await pool.query(
        `SELECT
          s.*,
          c.product_name,
          c.category,
          u.name AS owner_name,
          u.email AS owner_email,
          p.name AS provider_name

         FROM shipments s

         LEFT JOIN cargo c
           ON s.cargo_id = c.id

         INNER JOIN users u
           ON s.user_id = u.id

         INNER JOIN providers p
           ON s.provider_id = p.id

         WHERE p.user_id = $1

         ORDER BY s.created_at DESC`,
        [req.user.id]
      )

      res.json(result.rows)

    } catch (error) {
      console.error('PROVIDER SHIPMENTS ERROR:', error)

      res.status(500).json({
        message: 'Failed to fetch assigned shipments'
      })
    }
  }
)


// =====================================================
// LOGISTICS PROVIDER - UPDATE SHIPMENT STATUS
// =====================================================

app.put(
  '/api/provider/shipments/:id/status',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Logistics Provider') {
        return res.status(403).json({
          message: 'Logistics Provider access required'
        })
      }

      const {
        status
      } = req.body

      const result = await pool.query(
        `UPDATE shipments s

         SET status = $1

         FROM providers p

         WHERE s.id = $2
         AND s.provider_id = p.id
         AND p.user_id = $3

         RETURNING s.*`,
        [
          status,
          req.params.id,
          req.user.id
        ]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Assigned shipment not found'
        })
      }

      res.json(result.rows[0])

    } catch (error) {
      console.error(
        'PROVIDER UPDATE STATUS ERROR:',
        error
      )

      res.status(500).json({
        message: 'Failed to update shipment status'
      })
    }
  }
)


// =====================================================
// LOGISTICS PROVIDER - PROFILE
// =====================================================

app.get(
  '/api/provider/profile',
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== 'Logistics Provider') {
        return res.status(403).json({
          message: 'Logistics Provider access required'
        })
      }

      const result = await pool.query(
        `SELECT
          p.id,
          p.name,
          p.service_type,
          p.contact_email,
          p.phone,
          p.location,
          p.coverage,
          p.status,
          u.name AS account_name,
          u.email AS account_email

         FROM providers p

         INNER JOIN users u
           ON p.user_id = u.id

         WHERE p.user_id = $1`,
        [req.user.id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Provider profile not found'
        })
      }

      return res.status(200).json(result.rows[0])

    } catch (error) {

      console.error(
        'GET PROVIDER PROFILE ERROR:',
        error
      )

      return res.status(500).json({
        message: 'Failed to fetch provider profile'
      })
    }
  }
)


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Smart Cargo backend running on port ${PORT}`
  )
})