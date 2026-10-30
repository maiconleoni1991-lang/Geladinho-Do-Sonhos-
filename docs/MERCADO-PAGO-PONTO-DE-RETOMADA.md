# Ponto de retomada — Mercado Pago | Geladinho dos Sonhos

**Data do registro:** 29/10/2026 (horário de Brasília)  
**Etapa atual:** **TESTAR O WEBHOOK DE PRODUÇÃO POR GET** — ainda sem confirmação automática de pagamentos.

> Para retomar em outra conversa, diga: **"Retomar Mercado Pago do ponto salvo."**
> Este arquivo é um registro de progresso, não um comprovante de teste de produção ou de aprovação de cobrança automática.

## O que já foi feito (conforme a última conferência registrada na conversa)

- Projeto Supabase: **Geladinho dos Sonhos** — `qpqruhcspbdxjcnbhdhn`.
- Edge Function de produção criada/publicada: **`gds-mercadopago-webhook-prod`**.
- Opção **Verify JWT with legacy secret** da função desligada, para permitir chamadas de webhook externas; a validação de autenticidade deve ser feita pela assinatura HMAC.
- URL de produção registrada na configuração de Webhooks do Mercado Pago:  
  `https://qpqruhcspbdxjcnbhdhn.supabase.co/functions/v1/gds-mercadopago-webhook-prod`
- Evento marcado: **Order (Mercado Pago)**.
- Segredo de assinatura de produção registrado nos segredos do Supabase com o nome **`MP_WEBHOOK_PROD_SECRET`**. **O valor secreto não foi copiado para este arquivo.**
- Versão atual da função é **preparatória**: deve apenas validar notificações; **não confirma pagamentos**, não altera pedidos e não mexe no estoque. Para eventos reais ainda não conciliados, o código retorna 503, o que pode provocar novas tentativas de entrega do Mercado Pago.
- A loja mantém o processo atual de Pix/manual; pagamento automático por Pix e cartão **não foi liberado**.
- Cartão foi planejado como **crédito à vista (1x)**, com eventual taxa claramente apresentada ao comprador antes da confirmação, mas **a operação não foi habilitada**.

## Próximo passo EXATO — quando retomarmos

1. Acessar [Supabase — Funções](https://supabase.com/dashboard/project/qpqruhcspbdxjcnbhdhn/functions).
2. Abrir **`gds-mercadopago-webhook-prod`**.
3. Clicar em **Test** e escolher o método **GET** (sem usar credenciais reais no corpo).
4. Verificar se a função responde com status HTTP **200** e algo como:
   ```json
   {
     "servico": "Mercado Pago - Geladinho dos Sonhos",
     "etapa": "validacao",
     "pagamentos_automaticos": false
   }
   ```
5. Conferir logs e, em seguida, realizar um **teste controlado de notificação assinada** do Mercado Pago. Um GET bem-sucedido, sozinho, **não prova que a assinatura HMAC está correta**.

## Pendências antes de automatizar qualquer pagamento real

- Confirmar a integridade da verificação da assinatura de webhook com payload real e os parâmetros/cabeçalhos de produção.
- Implementar **conciliação server-to-server** consultando a API do Mercado Pago, com validação de estado e valor, vínculo com pedido e **idempotência**.
- Garantir processamento robusto e respostas adequadas a retentativas, sem duplicar aprovações nem debitar estoque indevidamente.
- Resolver o **aviso de limite/cota excedida no Supabase**, observado no painel, antes de depender dessa integração em produção. O aviso mencionava restrições potenciais a partir de **11/11/2026**; reavaliar a situação atual.
- Testar pedidos com segurança antes de mudar o checkout do site.

## Segurança

- **Nunca** compartilhar Access Token, assinatura secreta ou chaves no chat, imagens, GitHub ou frontend.
- O valor de `MP_WEBHOOK_PROD_SECRET` deve permanecer apenas no ambiente de segredos do Supabase.
- Não desligar funções existentes, nem alterar o checkout ou ativar confirmação automática até concluir os testes e a conciliação.

**Resumo curto:** estamos no **teste GET da função de produção**. A configuração do Mercado Pago e o registro do segredo foram dados como concluídos na conversa. **Cobrança/baixa automática: desligada.**
