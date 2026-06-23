import { zodResolver } from '@hookform/resolvers/zod'
import {
  CopyIcon,
  DownloadSimpleIcon,
  LinkIcon,
  TrashIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createLink } from '../api/create-link'
import { deleteLink } from '../api/delete-link'
import { exportLinks } from '../api/export-links'
import { getLinks } from '../api/get-links'
import type { Link } from '../api/types'
import { Logo } from '../components/logo'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { IconButton } from '../components/ui/icon-button'
import { Input } from '../components/ui/input'
import { Spinner } from '../components/ui/spinner'
import { env } from '../env'
import { getApiErrorMessage } from '../lib/api-error'
import {
  createLinkFormSchema,
  type CreateLinkForm,
} from '../lib/link-validation'
import { queryClient, shouldRetryQuery } from '../lib/query-client'

const pageIndex = 0
const limit = 50

function formatShortUrl(shortUrl: string) {
  const { host } = new URL(env.VITE_FRONTEND_URL)
  return `${host}/${shortUrl}`
}

function formatAccessCount(accessCount: number) {
  return `${accessCount} ${accessCount === 1 ? 'acesso' : 'acessos'}`
}

export function HomePage() {
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateLinkForm>({
    resolver: zodResolver(createLinkFormSchema),
    mode: 'onChange',
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  })

  const {
    data: linksResult,
    isLoading: isLoadingLinks,
    isError: isLinksError,
    error: linksError,
  } = useQuery({
    queryKey: ['links', pageIndex, limit],
    queryFn: () => getLinks({ pageIndex, limit }),
    retry: shouldRetryQuery,
  })

  const links = linksResult?.links ?? []

  const { mutateAsync: createLinkFn, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const {
    mutateAsync: deleteLinkFn,
    isPending: isDeletingLink,
    variables: deletingLink,
  } = useMutation({
    mutationFn: deleteLink,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const { mutateAsync: exportLinksFn, isPending: isExportingLinks } =
    useMutation({
      mutationFn: exportLinks,
    })

  async function handleCreateLink(data: CreateLinkForm) {
    try {
      await createLinkFn(data)
      reset()
    } catch (error) {
      const message = getApiErrorMessage(error)

      if (isAxiosError(error) && error.response?.status === 409) {
        setError('shortUrl', { type: 'server', message })
        return
      }

      setError('root', { type: 'server', message })
    }
  }

  async function handleExportLinks() {
    try {
      setExportError(null)
      const { publicUrl } = await exportLinksFn()
      window.open(publicUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      setExportError(getApiErrorMessage(error))
    }
  }

  async function handleDeleteLink(link: Link) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o link "${formatShortUrl(link.shortUrl)}"?`,
    )

    if (!confirmed) return

    try {
      setDeleteError(null)
      await deleteLinkFn({ id: link.id })
    } catch (error) {
      setDeleteError(getApiErrorMessage(error))
    }
  }

  return (
    <main className="min-h-screen bg-gray-200">
      <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6 px-3 pb-8 pt-8 md:px-6 lg:gap-5 lg:pt-[88px]">
        <Logo className="h-6 w-auto self-center lg:self-start" />

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
          <Card className="lg:w-[380px]">
            <form
              onSubmit={handleSubmit(handleCreateLink)}
              className="flex flex-col gap-6"
            >
              <h1 className="text-body-lg text-gray-600">Novo link</h1>

              <div className="flex flex-col gap-4">
                <Input
                  label="link original"
                  placeholder="www.exemplo.com.br"
                  error={errors.originalUrl?.message}
                  {...register('originalUrl')}
                />
                <Input
                  label="link encurtado"
                  placeholder="brev.ly/"
                  error={errors.shortUrl?.message}
                  {...register('shortUrl')}
                />
              </div>

              {errors.root?.message && (
                <FormAlert message={errors.root.message} />
              )}

              <Button
                type="submit"
                loading={isPending}
                disabled={!isValid || isSubmitting}
              >
                Salvar link
              </Button>
            </form>
          </Card>

          <Card className="gap-5 lg:max-w-[580px] lg:flex-1 lg:gap-5">
            <header className="flex items-center justify-between gap-4">
              <h2 className="text-body-lg text-gray-600">Meus links</h2>
              <Button
                type="button"
                variant="secondary"
                loading={isExportingLinks}
                disabled={isExportingLinks}
                className="shrink-0"
                icon={<DownloadSimpleIcon size={16} />}
                onClick={() => void handleExportLinks()}
              >
                Baixar CSV
              </Button>
            </header>

            <div className="flex flex-col gap-4">
              <hr className="border-gray-300" />

              {exportError && <FormAlert message={exportError} />}
              {deleteError && <FormAlert message={deleteError} />}

              {isLoadingLinks && (
                <div className="flex justify-center py-8">
                  <Spinner label="Carregando links" />
                </div>
              )}

              {isLinksError && (
                <div className="flex justify-center py-8">
                  <FormAlert message={getApiErrorMessage(linksError)} />
                </div>
              )}

              {!isLoadingLinks && !isLinksError && links.length === 0 && (
                <div className="flex flex-col items-center gap-3 px-0 pb-6 pt-4">
                  <LinkIcon size={32} className="text-gray-500" aria-hidden />
                  <p className="max-w-[284px] text-center text-body-xs uppercase text-gray-500">
                    ainda não existem links cadastrados
                  </p>
                </div>
              )}

              {!isLoadingLinks &&
                !isLinksError &&
                links.map((link, index) => (
                  <div key={link.id} className="flex flex-col gap-4">
                    {index > 0 && <hr className="border-gray-300" />}
                    <LinkRow
                      link={link}
                      onDelete={handleDeleteLink}
                      isDeleting={
                        isDeletingLink && deletingLink?.id === link.id
                      }
                    />
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

function FormAlert({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2" role="alert">
      <WarningIcon size={16} className="shrink-0 text-danger" aria-hidden />
      <span className="text-body-sm text-gray-500">{message}</span>
    </div>
  )
}

function LinkRow({
  link,
  onDelete,
  isDeleting,
}: {
  link: Link
  onDelete: (link: Link) => void
  isDeleting: boolean
}) {
  return (
    <div className="flex items-center gap-3 py-0.5 lg:gap-5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-md text-blue-base">
          {formatShortUrl(link.shortUrl)}
        </p>
        <p className="truncate text-body-sm font-normal text-gray-500">
          {link.originalUrl}
        </p>
      </div>

      <p className="shrink-0 text-right text-body-sm text-gray-500">
        {formatAccessCount(link.accessCount)}
      </p>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton aria-label="Copiar link" disabled>
          <CopyIcon size={16} />
        </IconButton>
        <IconButton
          aria-label="Excluir link"
          disabled={isDeleting}
          onClick={() => onDelete(link)}
        >
          <TrashIcon size={16} />
        </IconButton>
      </div>
    </div>
  )
}
