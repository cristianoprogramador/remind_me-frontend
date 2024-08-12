"use client";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
              Dashboard
            </li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
              Minhas Anotações
            </li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
              Configurações
            </li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">Sair</li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="w-3/4 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Minhas Anotações</h1>
        <div className="space-y-6">
          {/* Estrutura de Post */}
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="font-semibold text-xl">Título da Anotação</h2>
            <p className="mt-2 text-gray-600">
              Conteúdo da anotação. Aqui vai o texto da anotação que o usuário
              fez.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <span>Criado em: 12 de agosto de 2024</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="font-semibold text-xl">Título da Anotação</h2>
            <p className="mt-2 text-gray-600">
              Conteúdo da anotação. Aqui vai o texto da anotação que o usuário
              fez.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <span>Criado em: 11 de agosto de 2024</span>
            </div>
          </div>

          {/* Continue adicionando mais posts aqui */}
        </div>
      </main>
    </div>
  );
}
