# Geladinho dos Sonhos — ponto de retomada da integração Mercado Pago Pix

**Situação: PAUSADA a pedido do proprietário em 21/10/2026 (horário de Brasília).**
**Não ativar pagamentos automáticos em produção sem pedido explícito do proprietário.**
**Este arquivo é apenas um registro da situação; não configura a integração.**

## O que permanece funcionando

- Loja oficial: https://www.geladinhodosonhos.com.br/
- Painel administrativo: https://www.geladinhodosonhos.com.br/admin/
- Checkout Pix atual: fluxo com QR/código fixo, comprovante e conferência manual, **não integrado à API Mercado Pago**.
- Pedidos, estoque, caixa e histórico de vendas: não foram alterados por esta integração de testes.
- Não foi habilitada a confirmação automática de pagamentos de pedidos reais.

## O que foi realizado

1. Aplicação **Geladinho dos Sonhos** criada em Mercado Pago Developers para **Checkout Transparente / Orders API**.
2. Credenciais de teste ativadas. O usuário cadastrou diretamente no Supabase (sem expor os valores na conversa):
   - `MP_ACCESS_TOKEN_TEST` — Access Token **de testes**.
   - `MP_WEBHOOK_TEST_SECRET` — assinatura secreta do Webhook **de testes**.
3. Webhook configurado no Mercado Pago para evento **Order (Mercado Pago)**, em **Modo de teste**, apontando para a função:
   `https://qpqruhcspbdxjcnbhdhn.supabase.co/functions/v1/gds-mercadopago-webhook-test`
4. Supabase Edge Function `gds-mercadopago-webhook-test`, versão 5 no momento da pausa: receptor de teste, verifica assinatura e **não atualiza pagamentos/pedidos**.
5. Supabase Edge Function `gds-mercadopago-pix-test`, versão 3: permite a administrador autenticado criar e consultar cobrança Pix de **R$ 50,00 fictícios** pela Orders API, **sem criar pedidos/recebimentos na loja**.
6. Página administrativa de teste: `admin/mercadopago-teste.html` ou https://www.geladinhodosonhos.com.br/admin/mercadopago-teste.html . Exibe status, dados do QR/Pix Copia e Cola quando retornados, e consulta.
7. Cobranças fictícias retornaram tanto `action_required / waiting_transfer` (pendente) quanto `processed / accredited` (aprovada); HTTP 200 na API de consulta. O usuário confirmou ter visualizado o QR Code na página.

## Bloqueador antes da integração real

**O Webhook de cobranças de teste chegou ao Supabase, mas retornou HTTP 401 com `signature_mismatch`.**

- Verificado em registros `function_edge_logs` e `function_logs`, inclusive tentativa de ~22/10/2026 01:40 UTC (21/10 22:40 BRT).
- A assinatura do Webhook real de teste precisa ser validada; **não reduzir ou remover a verificação HMAC** para aceitar HTTP 200.
- Rever correspondência entre aplicação, **secret de Webhook no modo de teste** e `MP_WEBHOOK_TEST_SECRET` no Supabase; verificar conforme documentação/SDK oficial, inclusive composição do manifesto `data.id`, `x-request-id`, `ts` e eventuais diferenças de ambiente.
- O HTTP 200 do botão **Simular notificação** do Mercado Pago era de uma fixture estática de **Point/cartão** e NÃO confirma a entrega dos Webhooks de cobranças Pix de teste.

## Quando o proprietário decidir retomar

1. Primeiro corrigir e verificar as assinaturas dos Webhooks de testes, sem pedir para enviar tokens ou assinaturas no chat. Os segredos devem permanecer no painel Supabase.
2. Obter pelo menos um ciclo válido de criação de order Pix fictícia → notificação assinada → consulta independente da order no Mercado Pago → confirmação observada, ainda sem alterar vendas reais.
3. Projetar o Pix **individual por pedido online**, com valor obtido do banco (nunca confiando no valor do navegador), referência única, idempotência e armazenamento seguro do vínculo order local ↔ order Mercado Pago; RLS e acesso restrito.
4. Implementar a conciliação **no servidor**: verificar assinatura, consultar order na API, comparar identificador/valor/moeda/conta/status, ignorar notificações repetidas, preservar pedidos cancelados e históricos. Respeitar o bloqueio de preparação de Pix não pago.
5. Mostrar QR Pix do pedido no acompanhamento e refletir atualização de pagamento na loja e no painel admin. Testar falhas, cancelamentos, expiração, pagamento tardio, pedidos anteriores e webhooks repetidos.
6. Somente depois, com autorização expressa, configurar **credenciais de produção** e Webhook produtivo separado, fazer teste controlado e ativar gradualmente o Pix automático.

## Cuidados

- **Não** publicar Access Token, assinatura secreta, JWT ou outras credenciais no GitHub, HTML, frontend ou conversa.
- A máquina **Mercado Pago Point** é outro fluxo, não está integrada.
- O usuário quer retomar sem refazer as etapas já concluídas. Basta dizer: **“Retomar integração Pix Mercado Pago do Geladinho dos Sonhos”** e consultar este arquivo.
- O painel Supabase sinalizou aviso de cota/uso no período anterior; revisar limites antes de depender de notificações em produção.
- Não foram agendadas automações ou verificações recorrentes referentes a essa pausa.
