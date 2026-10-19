# Tejiendo Redes — versión HTML, CSS y JavaScript nativos

Tarea #1, Unidad 1 · Aplicaciones Web · Universidad Politécnica Salesiana
Autor: Carlos Daniel Morales Trelles (Cranel Studios)

Sitio de una sola página del **Centro Psicopedagógico Tejiendo Redes** (Paute, Azuay), escrito sin frameworks ni librerías. Es una versión ligera e independiente del sitio en producción hecho con Next.js ([tejiendo-redes](https://github.com/DanCranel/tejiendo-redes)).

**Demo:** https://dancranel.github.io/tejiendo-redes-html/

## Estructura

```
index.html        HTML5 semántico (header, nav, main, section, address, footer)
css/styles.css    CSS mobile first: variables, Grid/Flexbox y 2 media queries (40em y 64em)
js/main.js        Menú adaptable, filtro de servicios y validación accesible del formulario
img/              Mascota Teji en WebP (480/900 px) con respaldo PNG, íconos SVG
capturas/         Capturas a 375, 768 y 1280 px
```

## Ejecutar

No necesita instalación: abre `index.html` en el navegador.

## Pruebas realizadas

- html-validate (reglas recomendadas): 0 errores.
- axe-core (WCAG 2.1 A/AA + buenas prácticas): 0 infracciones.
- Sin desbordamiento horizontal a 320, 375, 768 y 1280 px, ni con zoom al 200 %.
- Navegación completa con teclado y foco visible (contorno de 3 px).
