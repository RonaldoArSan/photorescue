# PhotoRestore AI

Uma aplicação Next.js que restaura fotos antigas usando Inteligência Artificial avançada com modelos especializados em restauração de imagens.

## 🚀 Funcionalidades

- **Upload de Fotos**: Arraste e solte ou clique para enviar fotos
- **Restauração por IA**: Usa GFPGAN (modelo especializado em restauração de fotos antigas)
- **Processamento Local Avançado**: Fallback inteligente com algoritmos de processamento de imagem
- **Galeria**: Visualize todas as suas restaurações
- **Comparação Antes/Depois**: Slider interativo para comparar resultados
- **Download**: Baixe suas fotos restauradas em alta qualidade

## 🛠️ Tecnologias

- Next.js 16.0.0 (App Router)
- React 19.2.0
- TypeScript
- Tailwind CSS
- React Query
- Replicate (GFPGAN para restauração de fotos)
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

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Adicione seu token do Replicate no `.env.local`:
```env
REPLICATE_API_TOKEN=r8_seu_token_aqui
```

5. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## ⚙️ Configuração da API de Restauração

### Opção 1: Replicate + GFPGAN (Recomendado) ⭐

Esta é a melhor opção para restauração real de fotos. O GFPGAN é um modelo de IA treinado especificamente para restaurar fotos antigas e melhorar rostos.

**Vantagens:**
- ✅ Realmente processa sua imagem de entrada (não gera imagens aleatórias)
- ✅ Especializado em restauração de fotos antigas
- ✅ Melhora qualidade de rostos automaticamente
- ✅ Aumenta resolução (upscaling 2x)
- ✅ Muito mais barato que DALL-E (~$0.005 por imagem)

**Como configurar:**
1. Veja o guia completo em: [`docs/REPLICATE_SETUP.md`](./docs/REPLICATE_SETUP.md)
2. Crie conta em: https://replicate.com
3. Obtenha seu token em: https://replicate.com/account/api-tokens
4. Adicione no `.env.local`:
```env
REPLICATE_API_TOKEN=r8_seu_token_aqui
```

### Opção 2: Processamento Local (Fallback Automático)

Se você não configurar o Replicate, a aplicação automaticamente usa processamento local avançado:

**Funcionalidades:**
- ✅ Ajuste automático de brilho e contraste
- ✅ Redução de ruído (filtro bilateral)
- ✅ Aumento de nitidez
- ✅ Correção automática de cor
- ✅ Aumento de saturação
- ✅ 100% gratuito, roda no navegador
- ⚠️ Resultados inferiores ao GFPGAN para danos severos

**Quando usar:**
- Desenvolvimento/testes sem custos
- Melhorias básicas em fotos
- Quando não quer dependências externas

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── restore/       # Endpoint de restauração com IA
│   │   └── proxy-image/   # Proxy para imagens externas
│   ├── gallery/           # Página da galeria
│   ├── globals.css        # Estilos globais
│   ├── Home.tsx           # Componente da página inicial
│   ├── layout.tsx         # Layout raiz
│   ├── Navigation.tsx     # Componente de navegação
│   ├── page.tsx           # Página inicial
│   └── Providers.tsx      # Providers (React Query)
├── api/                   # Cliente da API
│   └── photoRestoreAI.ts  # Lógica principal de restauração
├── components/            # Componentes React
│   ├── gallery/          # Componentes da galeria
│   ├── restore/          # Componentes de restauração
│   ├── ui/               # Componentes base
│   └── upload/           # Componentes de upload
└── types/                # Definições de tipos
```

## 🎨 Como Funciona a Restauração

### Com Replicate (GFPGAN):

1. **Upload**: Usuário faz upload da foto
2. **Backend**: Next.js API Route recebe a imagem
3. **Replicate**: Imagem é enviada para o modelo GFPGAN
4. **Processamento**: IA analisa e restaura a foto
5. **Resultado**: URL da imagem restaurada é retornada
6. **Proxy**: Imagem é baixada via proxy (evita CORS)
7. **Exibição**: Usuário vê o resultado

### Modo Local (Fallback):

1. **Upload**: Usuário faz upload da foto
2. **Canvas API**: Imagem carregada no Canvas HTML5
3. **Processamento Pixel-a-Pixel**:
   - Normalização de histograma (brilho/contraste)
   - Filtro bilateral (redução de ruído)
   - Realce de bordas (nitidez)
   - Balanço de branco + saturação
4. **Resultado**: Nova imagem processada
5. **Exibição**: Usuário vê o resultado

## 🔧 Desenvolvimento

### Trocar Modelo de IA

Você pode experimentar outros modelos editando `src/app/api/restore/route.ts`:

**Real-ESRGAN** (melhor para upscaling geral):
```typescript
const output = await replicate.run(
  "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
  { input: { image: base64Image, scale: 2, face_enhance: true } }
);
```

**CodeFormer** (melhor para rostos muito danificados):
```typescript
const output = await replicate.run(
  "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
  { input: { image: base64Image, codeformer_fidelity: 0.7, upscale: 2 } }
);
```

### Melhorar Processamento Local

Edite os métodos em `src/api/photoRestoreAI.ts`:
- `autoAdjustBrightnessContrast()` - Ajusta brilho/contraste
- `applyDenoising()` - Reduz ruído
- `applySharpen()` - Aumenta nitidez
- `autoColorCorrection()` - Corrige cores

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente no dashboard:
   - `REPLICATE_API_TOKEN=r8_seu_token`
3. Deploy automático a cada push

### Variáveis de Ambiente Necessárias

```env
# Produção
REPLICATE_API_TOKEN=r8_seu_token_do_replicate

# Opcional (para frontend verificar se IA está habilitada)
NEXT_PUBLIC_REPLICATE_API_TOKEN=configured
```

## 💰 Custos

### Replicate GFPGAN
- **Custo**: ~$0.005 por imagem (meio centavo)
- **Créditos Grátis**: Sim, ao criar conta
- **Quando Cobra**: Apenas quando usa o modelo

### Modo Local
- **Custo**: $0.00 (gratuito)
- **Limitação**: Resultados básicos

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Documentação Completa**: Veja [`docs/`](./docs/)
- **Setup do Replicate**: [`docs/REPLICATE_SETUP.md`](./docs/REPLICATE_SETUP.md)
- **Issues**: Abra uma issue no GitHub
- **Replicate Docs**: https://replicate.com/docs
