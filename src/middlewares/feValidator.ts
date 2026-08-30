import { Request, Response, NextFunction } from 'express';

/**
 * Sanitiza strings contra injeção de scripts e tags maliciosas
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Middleware para validar e sanitizar os dados de contratação de plano SALVÓ Fé
 */
export function validatePlanPurchasePayload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { planId, paymentMethod, merchantName, storeName, whatsapp } = req.body;

  const validPlans = ['local', 'plus', 'premium'];
  const validMethods = ['pix', 'credit_card', 'boleto'];

  if (!planId || !validPlans.includes(planId)) {
    return res.status(400).json({
      error: 'Plano inválido. Escolha entre: local, plus ou premium.',
      code: 'INVALID_PLAN_TIER',
    });
  }

  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    return res.status(400).json({
      error: 'Método de pagamento inválido. Escolha entre: pix, credit_card ou boleto.',
      code: 'INVALID_PAYMENT_METHOD',
    });
  }

  if (!merchantName || !storeName || !whatsapp) {
    return res.status(400).json({
      error: 'Dados obrigatórios ausentes: Nome do Responsável, Nome da Loja e WhatsApp.',
      code: 'MISSING_REQUIRED_FIELDS',
    });
  }

  // Sanitiza dados de entrada
  req.body.merchantName = sanitizeString(merchantName);
  req.body.storeName = sanitizeString(storeName);
  req.body.whatsapp = sanitizeString(whatsapp);

  next();
}

/**
 * Middleware para validar e sanitizar criação de Anúncio / Criativo
 */
export function validateAdCreativePayload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, imageUrl, destinationUrl, bidCpc } = req.body;

  if (!title || title.trim().length < 5) {
    return res.status(400).json({
      error: 'O título do anúncio deve conter no mínimo 5 caracteres.',
      code: 'INVALID_AD_TITLE',
    });
  }

  if (!description || description.trim().length < 10) {
    return res.status(400).json({
      error: 'A descrição do anúncio deve conter no mínimo 10 caracteres informativos.',
      code: 'INVALID_AD_DESCRIPTION',
    });
  }

  if (!imageUrl || !imageUrl.startsWith('http')) {
    return res.status(400).json({
      error: 'URL de imagem válida é obrigatória para o banner.',
      code: 'INVALID_AD_IMAGE',
    });
  }

  if (!destinationUrl || !destinationUrl.startsWith('http')) {
    return res.status(400).json({
      error: 'Link de destino válido é obrigatório (ex: link do WhatsApp ou site).',
      code: 'INVALID_DESTINATION_URL',
    });
  }

  if (bidCpc && (isNaN(Number(bidCpc)) || Number(bidCpc) < 0.40)) {
    return res.status(400).json({
      error: 'O lance mínimo de CPC é de R$ 0,40.',
      code: 'INVALID_BID_AMOUNT',
    });
  }

  req.body.title = sanitizeString(title);
  req.body.description = sanitizeString(description);
  req.body.ctaText = sanitizeString(req.body.ctaText || 'Ver no WhatsApp');

  next();
}
