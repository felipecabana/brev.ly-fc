import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-md bg-gray-100 px-5 py-12 md:gap-6 md:px-12 md:py-16">
        <img
          src="/assets/404.svg"
          alt=""
          className="h-[72px] w-[164px] md:h-[85px] md:w-[194px]"
        />

        <h1 className="text-center text-body-xl text-gray-600">
          Link não encontrado
        </h1>

        <p className="text-center text-body-md text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma
          URL inválida. Saiba mais em{' '}
          <Link to="/" className="text-blue-base underline">
            brev.ly
          </Link>
          .
        </p>

        <Link to="/" className="w-full max-w-[280px]">
          <Button type="button">Voltar para a home</Button>
        </Link>
      </div>
    </main>
  )
}
