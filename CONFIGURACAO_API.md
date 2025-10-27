# Configuração da API do Google Gemini

## ✅ Implementação Completa

A aplicação PhotoRescue agora está totalmente integrada com o Google Gemini AI para restauração real de fotos usando o modelo **gemini-2.0-flash-exp** que suporta edição de imagens.

## Modelos Disponíveis e Recomendados

### ✅ Recomendado para Restauração de Imagens
- **`gemini-2.0-flash-exp`** - Modelo experimental que suporta edição e geração de imagens (ATUALMENTE EM USO)
- **`gemini-1.5-flash`** - Modelo rápido para análise de imagens (usado em testes de conexão)
- **`gemini-1.5-pro`** - Modelo mais avançado com suporte a imagens

### ❌ Não Suportados para Imagens
- `gemini-pro` - Apenas texto
- `gemini-1.0-pro` - Versão básica sem suporte a imagens

## Como Configurar Sua Chave API

1. **Obtenha sua chave API**:
   - Acesse: https://aistudio.google.com/apikey
   - Faça login com sua conta Google
   - Clique em "Create API Key"
   - Crie uma nova chave API

2. **Configure no projeto**:
   ```bash
   # Crie ou edite o arquivo .env.local na raiz do projeto
   NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=SUA_CHAVE_AQUI
   ```

3. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

## Funcionalidades Implementadas

### ✅ Verificação de Status da API
- Verifica se a chave está configurada
- Testa a conexão com o Gemini
- Exibe status em tempo real na interface

### ✅ Restauração de Fotos
- Converte arquivo de imagem para base64
- Envia para o Gemini com prompt otimizado
- Recebe imagem restaurada
- Exibe resultado com slider antes/depois

### ✅ Tratamento de Erros
- Mensagens de erro claras
- Fallback para modo simulação se API não estiver configurada
- Logs detalhados no console para debugging

## Estrutura do Código

### `src/api/photoRestoreAI.ts`
```typescript
class PhotoRestoreAIService {
  // Inicializa o cliente Gemini
  constructor()
  
  // Verifica configuração
  getConfigurationStatus()
  
  // Testa conexão
  testAIConnection()
  
  // Restaura foto (método principal)
  restorePhoto(file: File): Promise<PhotoRestoration>
}
```

### Fluxo de Restauração

1. **Upload da Foto** → Usuário seleciona arquivo
2. **Conversão** → Arquivo convertido para base64
3. **Envio ao Gemini** → Prompt + imagem enviados
4. **Processamento** → Gemini restaura a imagem
5. **Retorno** → Imagem restaurada convertida para blob URL
6. **Exibição** → Slider antes/depois + opção de download

## Prompt de Restauração

O prompt foi otimizado para obter os melhores resultados:

```
"Restaure esta foto antiga removendo danos, manchas, arranhões e 
melhorando cores, nitidez e qualidade geral. Mantenha a autenticidade 
da foto original."
```

## Dicas para Melhores Resultados

1. **Qualidade da Imagem**: Use fotos com resolução razoável (não muito pequenas)
2. **Formato**: JPG, PNG e WEBP são totalmente suportados
3. **Tamanho**: Imagens muito grandes podem levar mais tempo para processar
4. **Internet**: Conexão estável é necessária para o processamento

## Troubleshooting

### ❌ "API não configurada"
**Solução**: Adicione a chave no arquivo `.env.local`

### ❌ "Erro ao conectar com a API"
**Solução**: 
- Verifique se a chave está correta
- Confirme que tem créditos na API do Google
- Verifique sua conexão com a internet

### ❌ "Nenhuma imagem restaurada foi retornada"
**Solução**: 
- Tente com uma imagem menor
- Verifique se o formato é suportado
- Aguarde alguns segundos e tente novamente

## Verificação de Funcionamento

Após configurar, você deve ver:

1. ✅ **Indicador verde**: "IA funcionando" no topo da página
2. ✅ **Botão "Testar"**: Funciona sem erros
3. ✅ **Restauração**: Gera imagem restaurada com sucesso

## Limites e Custos

- O Google Gemini tem uma cota gratuita generosa
- Após a cota, há cobrança por uso
- Monitore seu uso em: https://aistudio.google.com/apikey
- Cada restauração consome tokens baseado no tamanho da imagem

## Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador (F12)
2. Teste a conexão usando o botão "Testar"
3. Confirme que sua chave API está ativa