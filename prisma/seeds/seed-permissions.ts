// src/lib/seedData.ts

export const initialPermissions = [
  // Users
  {
    name: 'users.view',
    description: 'Visualizar usuários',
    resource: { connect: { name: 'User' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'users.create',
    description: 'Criar usuários',
    resource: { connect: { name: 'User' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'users.update',
    description: 'Editar usuários',
    resource: { connect: { name: 'User' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'users.delete',
    description: 'Excluir usuários',
    resource: { connect: { name: 'User' } },
    action:   { connect: { name: 'delete' } },
  },

  // Sessions
  {
    name: 'sessions.view',
    description: 'Visualizar sessões de login',
    resource: { connect: { name: 'Session' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'sessions.create',
    description: 'Criar sessões de login',
    resource: { connect: { name: 'Session' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'sessions.update',
    description: 'Editar sessões de login',
    resource: { connect: { name: 'Session' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'sessions.delete',
    description: 'Encerrar sessões de login',
    resource: { connect: { name: 'Session' } },
    action:   { connect: { name: 'delete' } },
  },

  // Tokens
  {
    name: 'tokens.view',
    description: 'Visualizar tokens de autenticação',
    resource: { connect: { name: 'Token' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'tokens.create',
    description: 'Gerar tokens de autenticação',
    resource: { connect: { name: 'Token' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'tokens.update',
    description: 'Editar tokens de autenticação',
    resource: { connect: { name: 'Token' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'tokens.delete',
    description: 'Revogar tokens de autenticação',
    resource: { connect: { name: 'Token' } },
    action:   { connect: { name: 'delete' } },
  },

  // Roles
  {
    name: 'roles.view',
    description: 'Visualizar funções/perfis',
    resource: { connect: { name: 'Role' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'roles.create',
    description: 'Criar funções/perfis',
    resource: { connect: { name: 'Role' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'roles.update',
    description: 'Editar funções/perfis',
    resource: { connect: { name: 'Role' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'roles.delete',
    description: 'Excluir funções/perfis',
    resource: { connect: { name: 'Role' } },
    action:   { connect: { name: 'delete' } },
  },

  // Permissions
  {
    name: 'permissions.view',
    description: 'Visualizar permissões',
    resource: { connect: { name: 'Permission' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'permissions.create',
    description: 'Criar permissões',
    resource: { connect: { name: 'Permission' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'permissions.update',
    description: 'Editar permissões',
    resource: { connect: { name: 'Permission' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'permissions.delete',
    description: 'Excluir permissões',
    resource: { connect: { name: 'Permission' } },
    action:   { connect: { name: 'delete' } },
  },

  // MenuItems
  {
    name: 'menuItems.view',
    description: 'Visualizar itens de menu',
    resource: { connect: { name: 'MenuItem' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'menuItems.create',
    description: 'Criar itens de menu',
    resource: { connect: { name: 'MenuItem' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'menuItems.update',
    description: 'Editar itens de menu',
    resource: { connect: { name: 'MenuItem' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'menuItems.delete',
    description: 'Excluir itens de menu',
    resource: { connect: { name: 'MenuItem' } },
    action:   { connect: { name: 'delete' } },
  },

  // AuditLogs
  {
    name: 'auditLogs.view',
    description: 'Visualizar registros de auditoria',
    resource: { connect: { name: 'AuditLog' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'auditLogs.create',
    description: 'Criar registro de auditoria',
    resource: { connect: { name: 'AuditLog' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'auditLogs.update',
    description: 'Editar registros de auditoria',
    resource: { connect: { name: 'AuditLog' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'auditLogs.delete',
    description: 'Excluir registros de auditoria',
    resource: { connect: { name: 'AuditLog' } },
    action:   { connect: { name: 'delete' } },
  },

  // UserConsents
  {
    name: 'userConsents.view',
    description: 'Visualizar consentimentos de usuários',
    resource: { connect: { name: 'UserConsent' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'userConsents.create',
    description: 'Criar consentimentos de usuários',
    resource: { connect: { name: 'UserConsent' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'userConsents.update',
    description: 'Editar consentimentos de usuários',
    resource: { connect: { name: 'UserConsent' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'userConsents.delete',
    description: 'Excluir consentimentos de usuários',
    resource: { connect: { name: 'UserConsent' } },
    action:   { connect: { name: 'delete' } },
  },

  // Products
  {
    name: 'products.view',
    description: 'Visualizar produtos',
    resource: { connect: { name: 'Product' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'products.create',
    description: 'Criar produtos',
    resource: { connect: { name: 'Product' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'products.update',
    description: 'Editar produtos',
    resource: { connect: { name: 'Product' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'products.delete',
    description: 'Excluir produtos',
    resource: { connect: { name: 'Product' } },
    action:   { connect: { name: 'delete' } },
  },

  // ProductTranslations
  {
    name: 'productTranslations.view',
    description: 'Visualizar traduções de produtos',
    resource: { connect: { name: 'ProductTranslation' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'productTranslations.create',
    description: 'Criar traduções de produtos',
    resource: { connect: { name: 'ProductTranslation' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'productTranslations.update',
    description: 'Editar traduções de produtos',
    resource: { connect: { name: 'ProductTranslation' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'productTranslations.delete',
    description: 'Excluir traduções de produtos',
    resource: { connect: { name: 'ProductTranslation' } },
    action:   { connect: { name: 'delete' } },
  },

  // ProductAssets
  {
    name: 'productAssets.view',
    description: 'Visualizar arquivos vinculados a produtos',
    resource: { connect: { name: 'ProductAsset' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'productAssets.create',
    description: 'Criar arquivos vinculados a produtos',
    resource: { connect: { name: 'ProductAsset' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'productAssets.update',
    description: 'Editar arquivos vinculados a produtos',
    resource: { connect: { name: 'ProductAsset' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'productAssets.delete',
    description: 'Excluir arquivos vinculados a produtos',
    resource: { connect: { name: 'ProductAsset' } },
    action:   { connect: { name: 'delete' } },
  },

  // Checkouts
  {
    name: 'checkouts.view',
    description: 'Visualizar checkouts',
    resource: { connect: { name: 'Checkout' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'checkouts.create',
    description: 'Criar checkouts',
    resource: { connect: { name: 'Checkout' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'checkouts.update',
    description: 'Editar checkouts',
    resource: { connect: { name: 'Checkout' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'checkouts.delete',
    description: 'Excluir checkouts',
    resource: { connect: { name: 'Checkout' } },
    action:   { connect: { name: 'delete' } },
  },

  // CheckoutTranslations
  {
    name: 'checkoutTranslations.view',
    description: 'Visualizar traduções de checkout',
    resource: { connect: { name: 'CheckoutTranslation' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'checkoutTranslations.create',
    description: 'Criar traduções de checkout',
    resource: { connect: { name: 'CheckoutTranslation' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'checkoutTranslations.update',
    description: 'Editar traduções de checkout',
    resource: { connect: { name: 'CheckoutTranslation' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'checkoutTranslations.delete',
    description: 'Excluir traduções de checkout',
    resource: { connect: { name: 'CheckoutTranslation' } },
    action:   { connect: { name: 'delete' } },
  },

  // CheckoutOrderBumps
  {
    name: 'checkoutOrderBumps.view',
    description: 'Visualizar ofertas adicionais',
    resource: { connect: { name: 'CheckoutOrderBump' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'checkoutOrderBumps.create',
    description: 'Criar ofertas adicionais',
    resource: { connect: { name: 'CheckoutOrderBump' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'checkoutOrderBumps.update',
    description: 'Editar ofertas adicionais',
    resource: { connect: { name: 'CheckoutOrderBump' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'checkoutOrderBumps.delete',
    description: 'Excluir ofertas adicionais',
    resource: { connect: { name: 'CheckoutOrderBump' } },
    action:   { connect: { name: 'delete' } },
  },

  // Orders
  {
    name: 'orders.view',
    description: 'Visualizar pedidos',
    resource: { connect: { name: 'Order' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'orders.create',
    description: 'Criar pedidos',
    resource: { connect: { name: 'Order' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'orders.update',
    description: 'Editar pedidos',
    resource: { connect: { name: 'Order' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'orders.delete',
    description: 'Excluir pedidos',
    resource: { connect: { name: 'Order' } },
    action:   { connect: { name: 'delete' } },
  },

  // OrderItems
  {
    name: 'orderItems.view',
    description: 'Visualizar itens de pedido',
    resource: { connect: { name: 'OrderItem' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'orderItems.create',
    description: 'Criar itens de pedido',
    resource: { connect: { name: 'OrderItem' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'orderItems.update',
    description: 'Editar itens de pedido',
    resource: { connect: { name: 'OrderItem' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'orderItems.delete',
    description: 'Excluir itens de pedido',
    resource: { connect: { name: 'OrderItem' } },
    action:   { connect: { name: 'delete' } },
  },

  // AccessTokens
  {
    name: 'accessTokens.view',
    description: 'Visualizar tokens de acesso',
    resource: { connect: { name: 'AccessToken' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'accessTokens.create',
    description: 'Criar tokens de acesso',
    resource: { connect: { name: 'AccessToken' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'accessTokens.update',
    description: 'Editar tokens de acesso',
    resource: { connect: { name: 'AccessToken' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'accessTokens.delete',
    description: 'Excluir tokens de acesso',
    resource: { connect: { name: 'AccessToken' } },
    action:   { connect: { name: 'delete' } },
  },

  // Downloads
  {
    name: 'downloads.view',
    description: 'Visualizar logs de download',
    resource: { connect: { name: 'Download' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'downloads.create',
    description: 'Criar logs de download',
    resource: { connect: { name: 'Download' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'downloads.update',
    description: 'Editar logs de download',
    resource: { connect: { name: 'Download' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'downloads.delete',
    description: 'Excluir logs de download',
    resource: { connect: { name: 'Download' } },
    action:   { connect: { name: 'delete' } },
  },

  // Webhooks
  {
    name: 'webhooks.view',
    description: 'Visualizar webhooks',
    resource: { connect: { name: 'Webhook' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'webhooks.create',
    description: 'Criar webhooks',
    resource: { connect: { name: 'Webhook' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'webhooks.update',
    description: 'Editar webhooks',
    resource: { connect: { name: 'Webhook' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'webhooks.delete',
    description: 'Excluir webhooks',
    resource: { connect: { name: 'Webhook' } },
    action:   { connect: { name: 'delete' } },
  },

  // WebhookLogs
  {
    name: 'webhookLogs.view',
    description: 'Visualizar logs de webhooks',
    resource: { connect: { name: 'WebhookLog' } },
    action:   { connect: { name: 'view' } },
  },
  {
    name: 'webhookLogs.create',
    description: 'Criar logs de webhooks',
    resource: { connect: { name: 'WebhookLog' } },
    action:   { connect: { name: 'create' } },
  },
  {
    name: 'webhookLogs.update',
    description: 'Editar logs de webhooks',
    resource: { connect: { name: 'WebhookLog' } },
    action:   { connect: { name: 'update' } },
  },
  {
    name: 'webhookLogs.delete',
    description: 'Excluir logs de webhooks',
    resource: { connect: { name: 'WebhookLog' } },
    action:   { connect: { name: 'delete' } },
  },
];
