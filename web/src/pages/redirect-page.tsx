import { WarningIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { getLinkBySlug } from '../api/get-link-by-slug'
import { incrementAccess } from '../api/increment-access'
import { Logo } from '../components/logo'
import { Card } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'
import { getApiErrorMessage } from '../lib/api-error'
import { isValidShortUrl } from '../lib/link-validation'
import { queryClient } from '../lib/query-client'
import { NotFoundPage } from './not-found-page'

function isNotFoundError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404
}

export function RedirectPage() {
  const { shortUrl = '' } = useParams<{ shortUrl: string }>()
  const hasValidSlug = isValidShortUrl(shortUrl)
  const didRedirect = useRef(false)
  const [incrementError, setIncrementError] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useQuery({
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

  const showNotFound =
    !hasValidSlug || (!isLoading && isError && isNotFoundError(error))

  const showFetchError =
    hasValidSlug && !isLoading && isError && !isNotFoundError(error)

  useEffect(() => {
    if (!link || isLoading || didRedirect.current) return

    didRedirect.current = true
    setIncrementError(null)

    incrementAccessFn({ id: link.id })
      .then(() => {
        void queryClient.invalidateQueries({ queryKey: ['links'] })
        window.location.href = link.originalUrl
      })
      .catch((incrementFailure: unknown) => {
        didRedirect.current = false
        setIncrementError(getApiErrorMessage(incrementFailure))
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

  if (showFetchError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
        <Card key={shortUrl} variant="centered">
          <Logo variant="icon" className="size-12" />

          <h1 className="text-center text-body-xl text-gray-600">
            Erro ao buscar link
          </h1>

          <RedirectAlert message={getApiErrorMessage(error)} />
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
      <Card key={shortUrl} variant="centered">
        <Logo variant="icon" className="size-12" />

        {isLoading && <Spinner label="Buscando link" />}

        <h1 className="text-center text-body-xl text-gray-600">
          {incrementError ? 'Falha ao redirecionar' : 'Redirecionando...'}
        </h1>

        {incrementError && <RedirectAlert message={incrementError} />}

        <div
          className="flex w-full flex-col items-center gap-1 text-center text-body-md text-gray-500"
          aria-live="polite"
        >
          <p className="max-w-[326px] md:max-w-none">
            {incrementError
              ? 'Não foi possível abrir o link automaticamente.'
              : 'O link será aberto automaticamente em alguns instantes.'}
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

function RedirectAlert({ message }: { message: string }) {
  return (
    <div
      className="flex w-full max-w-[326px] items-center gap-2 md:max-w-none"
      role="alert"
    >
      <WarningIcon size={16} className="shrink-0 text-danger" aria-hidden />
      <span className="text-body-sm text-gray-500">{message}</span>
    </div>
  )
}
