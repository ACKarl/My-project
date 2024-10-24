# InfluxUI front-end documentation

## Introduction
This document is used to introduce the front-end architecture and some important designs to all developers and stakeholders interested in the project.

Any developer is welcome to add comments to this document.

## CSS
In order to ensure the uniformity of the style while facilitating different developers to customize the style of their own pages, the front-end adopts a hierarchical CSS architecture, from low to high:
1. `global.css`: used to store the global CSS file of the project, to ensure the uniform appearance of the page in any case.
2. `components.css`: used to store style components that can be reused in multiple pages.
3. `/custom`: a folder used to centrally store the CSS files customized by each developer, where you can create your own customized styles as needed.

It is recommended to import 3 levels of files in order from top to bottom during import, so that the consistency of appearance can be guaranteed to the greatest extent, and in the event of style conflicts between different files, the CSS style with the highest customization system will be given priority.

If you are still confusing, you can follow the following example to import:
```
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/custom/custom.css">
```