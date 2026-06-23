import { zodResolver } from '@hookform/resolvers/zod'
import {
  CopyIcon,
  DownloadSimpleIcon,
  LinkIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createLink } from '../api/create-link'
import { deleteLink } from '../api/delete-link'
import { getLinks } from '../api/get-links'
import type { Link } from '../api/types'
import { Logo } from '../components/logo'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { IconButton } from '../components/ui/icon-button'
import { Input } from '../components/ui/input'
import { Spinner } from '../components/ui/spinner'
import { env } from '../env'
import { queryClient } from '../lib/query-client'

const pageIndex = 0
const limit = 50

const createLinkFormSchema = z.object({
  originalUrl: z.url('Informe uma URL válida.'),
  shortUrl: z
    .string()
    .regex(
      /^[a-zA-Z0-9_-]{3,32}$/,
      'Use entre 3 e 32 caracteres (letras, números, _ ou -).',
    ),
})

type CreateLinkForm = z.infer<typeof createLinkFormSchema>

function formatShortUrl(shortUrl: string) {
  const { host } = new URL(env.VITE_FRONTEND_URL)
  return `${host}/${shortUrl}`
}

function formatAccessCount(accessCount: number) {
  return `${accessCount} ${accessCount === 1 ? 'acesso' : 'acessos'}`
}

export function HomePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkForm>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  })

  const { data: linksResult, isLoading: isLoadingLinks } = useQuery({
    queryKey: ['links', pageIndex, limit],
    queryFn: () => getLinks({ pageIndex, limit }),
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

  async function handleCreateLink(data: CreateLinkForm) {
    await createLinkFn(data)
    reset()
  }

  async function handleDeleteLink(link: Link) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o link "${formatShortUrl(link.shortUrl)}"?`,
    )

    if (!confirmed) return

    await deleteLinkFn({ id: link.id })
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

              <Button type="submit" loading={isPending}>
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
                disabled
                className="shrink-0"
                icon={<DownloadSimpleIcon size={16} />}
              >
                Baixar CSV
              </Button>
            </header>

            <div className="flex flex-col gap-4">
              <hr className="border-gray-300" />

              {isLoadingLinks && (
                <div className="flex justify-center py-8">
                  <Spinner label="Carregando links" />
                </div>
              )}

              {!isLoadingLinks && links.length === 0 && (
                <div className="flex flex-col items-center gap-3 px-0 pb-6 pt-4">
                  <LinkIcon size={32} className="text-gray-500" aria-hidden />
                  <p className="max-w-[284px] text-center text-body-xs uppercase text-gray-500">
                    ainda não existem links cadastrados
                  </p>
                </div>
              )}

              {!isLoadingLinks &&
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
