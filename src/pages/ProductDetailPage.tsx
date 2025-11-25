import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link as RouterLink } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'

const PRODUCT_URL = 'https://api.escuelajs.co/api/v1/products'

// fetch product detail function
async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${PRODUCT_URL}/${id}`)
  if (!response.ok) {
    throw new Error('error loading product')
  }
  return response.json()
}

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()

// fetching 
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id ?? ''),
    enabled: Boolean(id),
  })

  if (isPending) {
    return (
      <Stack alignItems="center" mt={6}>
        <CircularProgress />
      </Stack>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error instanceof Error ? error.message : 'Something went wrong'}
      </Alert>
    )
  }

  if (!data) return null

  return (
    <Container sx={{ py: 4 }}>
      <Button component={RouterLink} to="/" variant="outlined" sx={{ mb: 2 }}>
        Back to products
      </Button>
      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Box
            component="img"
            src={data.images?.[0]}
            alt={data.title}
            sx={{
              width: { xs: '100%', md: 440 },
              height: { xs: 320, md: '100%' },
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <CardContent sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Typography variant="h4">{data.title}</Typography>
              <Typography color="text.secondary">{data.category.name}</Typography>
              <Typography variant="h5">${data.price.toFixed(2)}</Typography>
              <Typography>{data.description}</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {data.images?.slice(1).map((image, index) => (
                  <Box
                    key={image}
                    component="img"
                    src={image}
                    alt={`${data.title}-thumb-${index}`}
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: 1,
                      objectFit: 'cover',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                ))}
              </Stack>
              <Button
                variant="contained"
                color="primary"
                onClick={() => addToCart(data)}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add to cart
              </Button>
            </Stack>
          </CardContent>
        </Stack>
      </Card>
    </Container>
  )
}

