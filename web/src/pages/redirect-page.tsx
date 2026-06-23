import { useEffect, useRef, type MouseEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getLinkBySlug } from '../api/get-link-by-slug'
import { incrementAccess } from '../api/increment-access'
import { Logo } from '../components/logo'

const shortUrlRegex = /^[a-zA-Z0-9_-]{3,32}$/

function LinkNotFoundFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-4 rounded-md bg-gray-100 px-5 py-12 text-center md:px-12 md:py-16">
        <h1 className="text-body-xl text-gray-600">Link não encontrado</h1>
        <p className="text-body-md text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma
          URL inválida.
        </p>
        <Link to="/" className="text-body-md text-blue-base underline">
          Voltar para a home
        </Link>
      </div>
    </main>
  )
}

export function RedirectPage() {
  const { shortUrl = '' } = useParams<{ shortUrl: string }>()
  const hasValidSlug = shortUrlRegex.test(shortUrl)
  const didRedirect = useRef(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['link', shortUrl],
    queryFn: () => getLinkBySlug({ shortUrl }),
    enabled: hasValidSlug,
    retry: false,
  })

  const link = data?.link
  const originalUrl = link?.originalUrl

  const { mutateAsync: incrementAccessFn } = useMutation({
    mutationFn: incrementAccess,
  })

  const showNotFound = !hasValidSlug || (!isLoading && isError)

  useEffect(() => {
    if (!link || isLoading || didRedirect.current) return

    didRedirect.current = true

    incrementAccessFn({ id: link.id })
      .then(() => {
        window.location.href = link.originalUrl
      })
      .catch(() => {
        didRedirect.current = false
      })
  }, [link, isLoading, incrementAccessFn])

  function handleManualRedirect(event: MouseEvent<HTMLAnchorElement>) {
    if (!originalUrl) return

    event.preventDefault()
    window.location.href = originalUrl
  }

  if (showNotFound) {
    return <LinkNotFoundFallback />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
      <div
        key={shortUrl}
        className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-md bg-gray-100 px-5 py-12 md:px-12 md:py-16"
      >
        <Logo variant="icon" className="size-12" />

        <h1 className="text-center text-body-xl text-gray-600">
          Redirecionando...
        </h1>

        <div className="flex w-full flex-col items-center gap-1 text-center text-body-md text-gray-500">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?{' '}
            {originalUrl && !isLoading ? (
              <a
                href={originalUrl}
                onClick={handleManualRedirect}
                className="text-blue-base underline"
              >
                Acesse aqui
              </a>
            ) : (
              <span className="text-blue-base underline">Acesse aqui</span>
            )}
          </p>
        </div>
      </div>
    </main>
  )
}
