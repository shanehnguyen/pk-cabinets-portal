import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: '1',
    email: 'demo@example.com',
    contractorName: 'Shane Nguyen',
    businessName: 'Chen Design Studio',
    businessType: 'Interior Designer',
    phone: '(555) 123-4567',
    licenseNumber: 'CA-12345678'
  })

  const login = (email, password) => {
    // Mock login - in a real app, this would call an API
    setUser({
      id: '1',
      email,
      contractorName: 'Shane Nguyen',
      businessName: 'Chen Design Studio',
      businessType: 'Interior Designer',
      phone: '(555) 123-4567',
      licenseNumber: 'CA-12345678'
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
