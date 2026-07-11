# Site institucional — FONTESOFT

Site estático (HTML/CSS/JS puro, sem backend) da **FONTESOFT TECNOLOGIA LTDA**, pronto para hospedagem no GitHub Pages com o domínio próprio **fontesoft.com.br**.

## Estrutura

```
index.html          Página principal (one-page com âncoras)
404.html            Página de erro personalizada
CNAME               Domínio próprio para o GitHub Pages (fontesoft.com.br)
robots.txt          Diretivas para buscadores + referência ao sitemap
sitemap.xml         Sitemap com a URL canônica
site.webmanifest    Manifest com ícones e cores do tema
assets/
  css/style.css     Estilos (tema escuro, mobile-first)
  js/main.js        Menu mobile, animações, formulário de contato
  img/              Favicon, ícones e imagem Open Graph
```

## Publicação no GitHub Pages

1. Crie um repositório no GitHub e envie todos estes arquivos para a branch `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em **Settings → Pages → Custom domain**, informe `fontesoft.com.br` (o arquivo `CNAME` já está incluído) e ative **Enforce HTTPS** quando o certificado for emitido.

### DNS (no registrador do domínio)

- **Apex (`fontesoft.com.br`)** — registros `A` apontando para os IPs do GitHub Pages:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- **`www` (opcional)** — registro `CNAME` apontando para `<seu-usuario>.github.io`

## Pendências (TODOs deixados no código)

- [ ] **Links das lojas do PartyPad** — em `index.html`, seção `#partypad`, trocar os `href="#"` dos badges pelos links reais da App Store e do Google Play.
- [ ] **Política de Privacidade e Termos de Uso** — hoje apontam para `ovinifontes.github.io`; migrar para o domínio próprio quando as páginas estiverem publicadas nele.
- [ ] **E-mail** — `contato@fontesoft.com.br` é placeholder até o e-mail do domínio ser configurado.
- [ ] **Formulário** — atualmente abre o cliente de e-mail (`mailto:`). Se quiser envio direto sem backend, integre um serviço como Formspree ou FormSubmit trocando o handler em `assets/js/main.js`.

## Dados legais exibidos no site

- Razão social: **FONTESOFT TECNOLOGIA LTDA**
- CNPJ: **67.232.227/0001-33**
- País: **Brasil**
- E-mail: **contato@fontesoft.com.br**

Esses dados aparecem no rodapé de todas as páginas e na seção de contato, além dos dados estruturados (JSON-LD `Organization`) no `<head>` — úteis para os processos de verificação de organização no Google Play Console e no Apple Developer Program.
