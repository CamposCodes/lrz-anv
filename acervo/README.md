# acervo/

Material bruto de produção: fotos de sessão (`DJ/`, `TAROT/`, `OURIVES/`), não assets do
site. Organizado por vertente, sem outra estrutura.

## Por que isso não é `public/`

Nada aqui é servido nem entra no build. `acervo/` fica fora de todos os diretórios que o
Nuxt 4 varre (`app/`, `server/`, `public/`, `shared/`, `modules/`, `layers/`) — o build
nunca olha para cá. Foi por isso que o acervo saiu de `public/images/`: eram ~600 MB de
fotos que nenhum navegador pedia, indo para o deploy junto dos ~45 MB que o site
realmente serve.

## Regra de trabalho

Para publicar uma foto: copie ou derive dela um arquivo em `public/images/site/` com
nome semântico (`hero.jpg`, `face-jazz.jpg`, etc.) e referencie esse caminho no
componente. **Nunca aponte um componente para `acervo/`** — o caminho até funciona em
dev, mas quebra no build de produção, porque o arquivo não vai para o deploy.

## Sem git

Este projeto não tem repositório. `acervo/` é a única cópia destas fotos — não há
histórico, não há remoto, não há como recuperar um arquivo apagado daqui.
