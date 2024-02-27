# check-status-aws

### Acerca del proyecto

El proyecto está realizado con serverless y ts, el cual no ayudará a consultar periodicamente un grupo de urls para conocer el estado de la aplicación.

###### Estructura del proyecto:
El proyecto está estructurado en 2 carpetas:<ul>
<li>**Infra** : se encarga de crear los recursos necesario, como el bucket de s3 y los roles.</li>
<li>**Backend**: se encarga de crear las lambdas necesarias para la consulta junto con el layer necesario y la regla de eventBridge
</li>
</ul>


###### Tips:
en caso de que no se ejecute correctamente los comandos debido al uso de "cp" en widows, te recomiendo ejecutar los comandos uno por uno en el powershell: