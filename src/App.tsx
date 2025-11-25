
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  AppBar,
  Badge,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StorefrontIcon from '@mui/icons-material/Storefront'
import './App.css'
import { ProductListPage } from './pages/ProductListPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { useCart } from './context/CartContext'
import { ShoppingCart } from './components/ShoppingCart'

function App() {
  const { cartCount } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" color="primary" enableColorOnDark>
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <StorefrontIcon />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Shop Explorer
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            aria-label="open shopping cart"
            onClick={() => setCartOpen(true)}
          >
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ mt: 10, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </Box>

      <ShoppingCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default App
