import { useState } from 'react'

function App() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', phone: '' })
  const [status, setStatus] = useState({ loading: false, success: null, error: null })

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: null, error: null })

    try {
      const res = await fetch(`${backend}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || undefined,
          message: form.message,
          phone: form.phone || undefined,
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Request failed: ${res.status}`)
      }

      const data = await res.json()
      setStatus({ loading: false, success: `Thanks! Your message id is ${data.id}.`, error: null })
      setForm({ name: '', email: '', subject: '', message: '', phone: '' })
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-indigo-100">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-2">Have a question or feedback? Send us a message and we'll get back to you.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Jane Doe"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="jane@example.com"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="+1 555 0123"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Subject (optional)</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="How can we help?"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Write your message here..."
            />
          </div>

          {status.error && (
            <div className="col-span-1 md:col-span-2 text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-sm">
              {status.error}
            </div>
          )}

          {status.success && (
            <div className="col-span-1 md:col-span-2 text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
              {status.success}
            </div>
          )}

          <div className="col-span-1 md:col-span-2 flex items-center justify-between mt-2">
            <a href="/test" className="text-sm text-gray-500 hover:text-gray-700">Check backend connection</a>
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-60"
            >
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
