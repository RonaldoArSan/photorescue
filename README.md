# PhotoRestore AI

Uma aplicação Next.js que restaura fotos antigas usando Inteligência Artificial.

## 🚀 Funcionalidades

- **Upload de Fotos**: Arraste e solte ou clique para enviar fotos
- **Restauração por IA**: Processamento inteligente para restaurar fotos antigas
- **Galeria**: Visualize todas as suas restaurações
- **Comparação Antes/Depois**: Slider interativo para comparar resultados
- **Download**: Baixe suas fotos restauradas em alta qualidade

## 🛠️ Tecnologias

- Next.js 16.0.0 (App Router)
- React 19.2.0
- TypeScript
- Tailwind CSS
- React Query
- Lucide Icons

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd photorescue
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
cp .env.example .env.local
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## ⚙️ Configuração da API

### Modo Demonstração (Padrão)

Por padrão, a aplicação roda em modo demonstração com dados mock. Isso permite testar todas as funcionalidades sem precisar configurar uma API real.

### API Real

Para usar uma API real de restauração de fotos:

1. Configure a variável de ambiente no `.env.local`:
```env
NEXT_PUBLIC_NANO_BANANA_API_URL=https://sua-api.com/v1
```

2. Sua API deve implementar os seguintes endpoints:

- `POST /upload` - Upload de arquivo
- `POST /restore` - Restauração da foto
- `POST /restorations` - Salvar histórico
- `GET /restorations` - Listar histórico

### Estrutura da API

```typescript
// Upload Response
{
  file_url: string
}

// Restore Request
{
  image_url: string
}

// Restore Response
{
  restored_image_url: string
}

// Restoration Object
{
  id?: string
  original_url: string
  restored_url?: string
  status: 'processing' | 'completed' | 'failed'
  original_filename?: string
  processing_time?: number
  created_date?: string
}
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── gallery/           # Página da galeria
│   ├── globals.css        # Estilos globais
│   ├── Home.tsx           # Componente da página inicial
│   ├── layout.tsx         # Layout raiz
│   ├── Navigation.tsx     # Componente de navegação
│   ├── page.tsx           # Página inicial
│   └── Providers.tsx      # Providers (React Query)
├── api/                   # Cliente da API
│   └── nanoBananaClient.ts
├── components/            # Componentes React
│   ├── gallery/          # Componentes da galeria
│   ├── restore/          # Componentes de restauração
│   ├── ui/               # Componentes base
│   └── upload/           # Componentes de upload
├── types/                # Definições de tipos
└── utils/                # Utilitários
```

## 🎨 Componentes Principais

- **UploadZone**: Área de upload com drag & drop
- **ProcessingAnimation**: Animação durante processamento
- **BeforeAfterSlider**: Comparação antes/depois
- **PhotoCard**: Card para exibir fotos na galeria
- **FullScreenModal**: Modal em tela cheia

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

### Outros Providers

A aplicação é compatível com qualquer provedor que suporte Next.js:
- Netlify
- Railway
- Digital Ocean
- AWS Amplify

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email ou abra uma issue no GitHub.
