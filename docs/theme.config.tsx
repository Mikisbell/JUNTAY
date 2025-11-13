import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '24px' }}>📋</span>
      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>JUNTAY</span>
      <span style={{ 
        fontSize: '12px', 
        color: '#666', 
        backgroundColor: '#f0f0f0', 
        padding: '2px 6px', 
        borderRadius: '4px' 
      }}>
        DOCS
      </span>
    </div>
  ),
  project: {
    link: 'https://github.com/Mikisbell/JUNTAY',
  },
  chat: {
    link: 'https://wa.me/51999999999', // Reemplazar con WhatsApp de soporte
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
      </svg>
    )
  },
  docsRepositoryBase: 'https://github.com/Mikisbell/JUNTAY/tree/main/docs',
  footer: {
    text: (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>© 2025 JUNTAY - Sistema Integral Casa de Empeño</span>
        <span>Versión 1.0 - Documentación Oficial</span>
      </div>
    )
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – JUNTAY Docs',
      description: 'Documentación oficial del Sistema Integral JUNTAY para Casa de Empeño',
      openGraph: {
        type: 'website',
        locale: 'es_PE',
        site_name: 'JUNTAY Docs'
      }
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="JUNTAY Docs" />
      <meta property="og:description" content="Sistema Integral para Casa de Empeño" />
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>" />
    </>
  ),
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    }
  },
  toc: {
    backToTop: true
  },
  editLink: {
    text: 'Editar esta página en GitHub →'
  },
  feedback: {
    content: '¿Encontraste un error? Repórtalo →',
    labels: 'feedback'
  },
  search: {
    placeholder: 'Buscar en la documentación...'
  },
  gitTimestamp: ({ timestamp }) => (
    <span>Última actualización: {timestamp.toLocaleDateString('es-PE')}</span>
  )
}

export default config
