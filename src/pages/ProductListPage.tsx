import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const PRODUCTS_URL = 'https://api.escuelajs.co/api/v1/products'

// fetch product function
async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL)
  if (!response.ok) {
    throw new Error('Unable to load products')
  }
  return response.json()
}


export const ProductListPage = () => {
  const navigate =  useNavigate()

// fetching
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  })

  const { addToCart } = useCart()

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string>('all')

// filter by category
  const categories = useMemo(() => {
    if (!data) return []
    const unique = new Map<number, string>()
    data.forEach((product) => {
      if (!unique.has(product.category.id)) {
        unique.set(product.category.id, product.category.name)
      }
    })
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }))
  }, [data])

// search by title
  const filteredProducts = useMemo(() => {
    if (!data) return []

    return data.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryId === 'all' || product.category.id === Number(categoryId)
      return matchesSearch && matchesCategory
    })
  }, [data, search, categoryId])

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={2} mb={4}>
        <Typography variant="h4" component="h1">
          Discover products
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search by title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              label="Category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <MenuItem value="all">All categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {isPending && (
        <Stack alignItems="center" mt={6}>
          <CircularProgress />
        </Stack>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error instanceof Error ? error.message : 'Something went wrong'}
        </Alert>
      )}

      {!isPending && !isError && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0]}
                alt={product.title}
                sx={{ objectFit: 'cover', cursor:'pointer' }}
                onClick={()=>navigate(`/product/${product.id}`)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category.name}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
              
                <Button size="small" variant="contained" onClick={() => addToCart(product)}>
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  )
}

