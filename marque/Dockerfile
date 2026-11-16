# FluxSign : Documenso v2.22.0 (AGPL-3.0) rebaptisé pour Agence Flux Digital.
# Version modifiée : nom « Documenso » remplacé par « FluxSign » dans l'interface et les mails, logos remplacés,
# lien d'accueil vers le site de l'agence. Source des modifications : ce fichier (dépôt de l'agence).
FROM documenso/documenso:v2.22.0
USER root
COPY *.png *.ico *.jpg fr-complet.json code-fr.json catalogue-fr.mjs libelles.mjs logo-composant.mjs /tmp/marque/
RUN set -e; B=/app/apps/remix/build; \
    grep -rIl 'Documenso' $B | grep -v '\.map$' | xargs sed -i 's/Documenso/FluxSign/g'; \
    grep -rIl 'https://documenso.com"' $B | grep -v '\.map$' | xargs -r sed -i 's#https://documenso.com"#https://www.agence-fluxdigital.fr"#g'; \
    for d in $B/client /app/apps/remix/public; do \
      for f in android-chrome-192x192.png android-chrome-512x512.png apple-touch-icon.png favicon-16x16.png favicon-32x32.png favicon.ico opengraph-image.jpg; do [ -f $d/$f ] && cp /tmp/marque/$f $d/$f; done; \
      [ -f $d/static/logo.png ] && cp /tmp/marque/logo-static.png $d/static/logo.png; done; \
    cp /tmp/marque/logo.png $B/client/assets/logo-Nudru9Pm.png; cp /tmp/marque/logo_icon.png $B/client/assets/logo_icon-B_xTFJYh.png; \
    for f in $(grep -rIl 'logo-Nudru9Pm\|logo_icon-B_xTFJYh' $B/server 2>/dev/null | grep -v '\.map$'); do :; done; \
    find $B/server -name 'logo-Nudru9Pm.png' -exec cp /tmp/marque/logo.png {} \; ; \
    find $B/server -name 'logo_icon-B_xTFJYh.png' -exec cp /tmp/marque/logo_icon.png {} \; ; \
    grep -rIl 'Timur\|/u/timur\|image of timur' $B | grep -v '\.map$' | xargs -r sed -i -e 's/Timur Ercan/Arezki Ammour/g' -e 's/Timur/Arezki/g' -e 's#/u/timur#/u/arezki#g' -e 's/image of timur ercan founder of documenso/photo Arezki Ammour/g'; \
    cp /tmp/marque/avatar.png $B/client/assets/timur-CKDH0W6z.png; find $B/server -name 'timur-CKDH0W6z.png' -exec cp /tmp/marque/avatar.png {} \; ; \
    node /tmp/marque/catalogue-fr.mjs /tmp/marque/fr-complet.json $B; node /tmp/marque/libelles.mjs /tmp/marque/code-fr.json $B; node /tmp/marque/logo-composant.mjs $B; \
    rm -rf /tmp/marque; echo "reste: $(grep -rIl Documenso $B | grep -v '\.map$' | wc -l)"
# Correctifs du 16/11/2026, côté serveur uniquement (les fichiers du navigateur ne changent pas, pas de purge Cloudflare) :
# 1. pièce jointe du mail de fin nommée « x.pdf.pdf » (Documenso ajoute .pdf au titre puis le teste à nouveau) ;
# 2. heures du certificat et du journal d'audit au format français (le fuseau vient de TZ plus bas) ;
# 3. npm retiré de l'image (6 failles hautes Trivy, toutes dans npm) : les migrations passent par prisma en direct.
RUN set -e; S=/app/apps/remix/build/server; \
    F=$(grep -rIl "envelopeItem.title + ['\"]\.pdf['\"]" $S | grep -v '\.map$'); [ -n "$F" ]; \
    sed -i -E "s/envelopeItem\.title \+ ['\"]\.pdf['\"]/envelopeItem.title/" $F; \
    F=$(grep -rIl 'yyyy-MM-dd hh:mm:ss a (ZZZZ)' $S | grep -v '\.map$'); [ -n "$F" ]; \
    sed -i 's#yyyy-MM-dd hh:mm:ss a (ZZZZ)#dd/MM/yyyy HH:mm:ss (ZZZZ)#g' $F; \
    if grep -rIl "envelopeItem.title + ['\"]\.pdf\|yyyy-MM-dd hh:mm:ss a" $S | grep -v '\.map$'; then echo "correctif incomplet"; exit 1; fi; \
    sed -i 's#^npx prisma migrate deploy#node /app/node_modules/prisma/build/index.js migrate deploy#' /app/apps/remix/start.sh; \
    grep -q '^node /app/node_modules/prisma/build/index.js migrate deploy' /app/apps/remix/start.sh; \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx; \
# 4. pied des mails : le lien « envoyé avec FluxSign » mène à notre offre (masqué pour un client Illimité
#    par le réglage brandingHidePoweredBy de son organisation).
    F=$(grep -rIl 'https://documen.so/mail-footer' $S | grep -v '\.map$'); [ -n "$F" ]; \
    sed -i 's#https://documen.so/mail-footer#https://www.agence-fluxdigital.fr/signature-electronique/?src=mail-signature#g' $F
ENV TZ=Europe/Paris
USER nodejs
