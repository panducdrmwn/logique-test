import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { useCart } from '../context/CartContext'

type ShoppingCartProps = {
  open: boolean
  onClose: () => void
}

export const ShoppingCart = ({ open, onClose }: ShoppingCartProps) => {
  const { cartItems, removeFromCart, addToCart, clearCart, cartTotal } = useCart()

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 460, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose} aria-label="close cart drawer">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider />

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List>
            {cartItems.length === 0 && (
              <ListItem>
                <ListItemText primary="Your cart is empty." />
              </ListItem>
            )}
            {cartItems.map((item) => (
              <ListItem
                key={item.product.id}
                secondaryAction={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      edge="start"
                      aria-label="decrease quantity"
                      onClick={() => removeFromCart(item.product.id)}
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography minWidth={32} textAlign="center">
                      {item.quantity}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="increase quantity"
                      onClick={() => addToCart(item.product)}
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText
                  primary={item.product.title}
                  secondary={`$${item.product.price.toFixed(2)} each · $${(
                    item.product.price * item.quantity
                  ).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="subtitle1">${cartTotal.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={clearCart}
              disabled={!cartItems.length}
            >
              Clear
            </Button>
            <Button variant="contained" color="primary" fullWidth disabled={!cartItems.length}>
              Checkout
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}

