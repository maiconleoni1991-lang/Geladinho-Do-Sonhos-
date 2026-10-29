# Integração Mercado Pago — preparação para produção (29/10/2026)

Situação: ambiente de produção da aplicação do Mercado Pago ativado pela proprietária. **O checkout da loja NÃO está conectado à API de produção.**

## Estado confirmado

- No Mercado Pago Developers, em Produção > Configuração de webhooks, a URL está vazia e o evento **Order (Mercado Pago)** está marcado.
- No Supabase, existem as funções de TESTE gds-mercadopago-pix-test e gds-mercadopago-webhook-test, que não alteram pedidos reais.
- O checkout público segue com Pix de confirmação manual e dinheiro. As funções create-pix e check-pix permanecem desativadas.
- O teste anterior do webhook retornou assinatura inválida; o HTTP 200 do simulador Point não valida eventos Pix reais.
- Banco: pedidos em public.orders; itens em public.order_items. Ainda não há mapeamento entre IDs de orders do Mercado Pago e IDs de pedidos locais.

## Itens necessários antes de configurar a URL de produção

1. Criar uma Edge Function exclusiva de produção. Nunca reutilizar o webhook de testes.
2. Guardar MP_WEBHOOK_PROD_SECRET e MP_ACCESS_TOKEN_PROD **somente** em Supabase > Edge Functions > Secrets, preenchidos pela proprietária; não guardar segredos neste repositório, HTML ou mensagens.
3. Validar HMAC SHA-256 do header x-signature com data.id, x-request-id e ts (timestamp). Não remover a verificação para forçar HTTP 200.
4. Criar vinculação única de pedidos locais às orders Mercado Pago, com idempotência e autorização segura no servidor.
5. Após notificação autenticada, consultar GET /v1/orders/{id} com token de produção e conferir referência, valor/moeda, status de aprovação e titularidade, sem confiar só no payload recebido.
6. Evitar baixar estoque duas vezes, confirmar pedido cancelado ou reconhecer cobrança repetida.
7. Testar em cenário controlado criação do pedido, Pix, expiração, pagamento confirmado, repetição de webhook, notificações fora de ordem e estorno.
8. Só então cadastrar URL de produção no Mercado Pago, realizar venda real de valor reduzido e ativar gradualmente.
9. Mostrar taxas e recebimento líquido separadamente; não confundir faturamento bruto com valor disponível na conta.
10. Preservar fluxo da maquininha Point Pro sem vinculá-lo automaticamente ao checkout.

## Bloqueio atual

A função de produção ainda **não foi publicada**, portanto não existe uma URL pronta para salvar na tela de configuração do Mercado Pago. **Não clicar em Salvar** enquanto a URL não estiver preparada e validada.

Fontes técnicas:
- https://www.mercadopago.com.br/developers/en/docs/checkout-api-orders/notifications
- https://supabase.com/docs/guides/functions/auth

Nenhum pedido, produto, estoque ou saldo é modificado por este documento.
