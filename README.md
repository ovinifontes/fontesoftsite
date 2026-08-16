# Site institucional — FonteSoft

Site estático (HTML/CSS/JS puro, sem backend) da **FONTESOFT TECNOLOGIA LTDA**, pronto para hospedagem no GitHub Pages com o domínio próprio **fontesoft.com.br**.

Design baseado na identidade visual oficial da marca (pasta `refid/`): símbolo F fluido, gradiente ciano → azul elétrico → roxo, fundo azul-noite `#0B1220` e tipografia **Urbanist**.

## Estrutura

```
index.html          Página principal (one-page com âncoras)
privacidade.html    Política de Privacidade do PartyPad
termos.html         Termos de Uso do PartyPad
404.html            Página de erro personalizada
CNAME               Domínio próprio para o GitHub Pages (fontesoft.com.br)
robots.txt          Diretivas para buscadores + referência ao sitemap
sitemap.xml         Sitemap com a URL canônica
site.webmanifest    Manifest com ícones e cores do tema
favicon.ico         Favicon multi-tamanho servido da raiz
refid/              Identidade visual oficial (fonte dos assets — fora do git via .gitignore)
assets/
  css/style.css     Estilos (tema escuro, mobile-first)
  js/main.js        Menu mobile, animações de entrada, partículas do hero
  img/              Logo, favicon, ícones e imagem Open Graph (gerados do refid/)
```

## Contato do site

O site **não usa formulário**: todos os CTAs de contato abrem o WhatsApp
(`wa.me/5565992249488`) com mensagem pré-preenchida, falando direto com o
responsável pela equipe. Alternativas exibidas: e-mail e Instagram
(`@fontesoft.tech`).

## Publicação no GitHub Pages

1. Crie um repositório no GitHub e envie todos estes arquivos para a branch `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em **Settings → Pages → Custom domain**, informe `fontesoft.com.br` (o arquivo `CNAME` já está incluído) e ative **Enforce HTTPS** quando o certificado for emitido.

### DNS (no registrador do domínio)

- **Apex (`fontesoft.com.br`)** — registros `A` apontando para os IPs do GitHub Pages:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- **`www` (opcional)** — registro `CNAME` apontando para `<seu-usuario>.github.io`

## Páginas legais

Política de Privacidade (`/privacidade.html`) e Termos de Uso (`/termos.html`) do
PartyPad estão hospedados no domínio próprio. As versões em inglês continuam em
`ovinifontes.github.io` (linkadas no topo de cada página).

## Dados legais exibidos no site

- Razão social: **FONTESOFT TECNOLOGIA LTDA**
- CNPJ: **67.232.227/0001-33**
- País: **Brasil**
- E-mail: **contato@fontesoft.com.br**

Esses dados aparecem no rodapé, na seção "Sobre" e nos dados estruturados (JSON-LD `Organization`) do `<head>` — úteis para os processos de verificação de organização no Google Play Console e no Apple Developer Program.
