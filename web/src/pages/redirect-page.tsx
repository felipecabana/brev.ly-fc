import { useEffect, useRef, type MouseEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getLinkBySlug } from '../api/get-link-by-slug'
import { incrementAccess } from '../api/increment-access'
import { Logo } from '../components/logo'
import { Card } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'
import { NotFoundPage } from './not-found-page'

const shortUrlRegex = /^[a-zA-Z0-9_-]{3,32}$/

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
    return <NotFoundPage />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
      <Card key={shortUrl} variant="centered">
        <Logo variant="icon" className="size-12" />

        {isLoading && <Spinner label="Buscando link" />}

        <h1 className="text-center text-body-xl text-gray-600">
          Redirecionando...
        </h1>

        <div
          className="flex w-full flex-col items-center gap-1 text-center text-body-md text-gray-500"
          aria-live="polite"
        >
          <p className="max-w-[326px] md:max-w-none">
            O link será aberto automaticamente em alguns instantes.
          </p>
          <p>
            Não foi redirecionado?{' '}
            {originalUrl && !isLoading ? (
              <a
                href={originalUrl}
                onClick={handleManualRedirect}
                className="rounded-sm text-blue-base underline transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-base"
              >
                Acesse aqui
              </a>
            ) : (
              <span className="text-blue-base underline">Acesse aqui</span>
            )}
          </p>
        </div>
      </Card>
    </main>
  )
}
