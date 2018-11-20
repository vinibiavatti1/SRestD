/**
 * Method Colors
 */
var methodColors = {
    GET: "green",
    POST: "blue",
    DELETE: "red",
    PUT: "orange",
    HEAD: "purple",
    CONNECT: "deep-purple",
    OPTIONS: "indigo",
    TRACE: "teal",
    PATCH: "brown"
};

/**
 * Dictionary
 */
var translates = {
    "pt-BR": {
        "baseUrl": "URL Base",
        "version": "Versão",
        "contact": "Contato",
        "license": "Licença",
        "createdBy": "Criado por",
        "deprecatedDesc": "Esta rotina se encontra deprecada na API",
        "header": "Cabeçalho",
        "headerName": "Nome",
        "headerType": "Tipo",
        "headerDesc": "Descrição",
        "urlParams": "Parâmetros da URL",
        "urlName": "Nome",
        "urlType": "Tipo",
        "urlDesc": "Descrição",
        "requestBody": "Corpo da Requisição",
        "bodyParametersDesc": "Parâmetros do Corpo da Requisição",
        "bodyName": "Nome",
        "bodyType": "Tipo",
        "bodyDesc": "Descrição",
        "responses": "Respostas",
        "responseCode": "Código",
        "responseDesc": "Descrição",
        "responseBody": "Corpo da Resposta"
    },
    "en-US": {
        "baseUrl": "Base URL",
        "version": "Version",
        "contact": "Contact",
        "license": "License",
        "createdBy": "Created By",
        "deprecatedDesc": "This routine is deprecated on API",
        "header": "Header",
        "headerName": "Name",
        "headerType": "Type",
        "headerDesc": "Description",
        "urlParams": "URL Parameters",
        "urlName": "Name",
        "urlType": "Type",
        "urlDesc": "Description",
        "requestBody": "Request Body",
        "bodyParametersDesc": "Request Body Parameters",
        "bodyName": "Name",
        "bodyType": "Type",
        "bodyDesc": "Description",
        "responses": "Responses",
        "responseCode": "Code",
        "responseDesc": "Description",
        "responseBody": "Response Body"
    },
    "default": "en-US"
}

/**
 * Translate doc by locale
 * @param {String} doc
 * @param {String} locale
 */
function translate(doc, locale) {
    var internalDoc = doc;
    var dictionary = translates[locale];
    internalDoc = replaceRegex(/:TXT_DEPRECATED/g, dictionary["deprecatedDesc"], internalDoc);
    internalDoc = replaceRegex(/:TXT_HEADER_NAME/g, dictionary["headerName"], internalDoc);
    internalDoc = replaceRegex(/:TXT_HEADER_TYPE/g, dictionary["headerType"], internalDoc);
    internalDoc = replaceRegex(/:TXT_HEADER_DESC/g, dictionary["headerDesc"], internalDoc);
    internalDoc = replaceRegex(/:TXT_HEADER/g, dictionary["header"], internalDoc);
    internalDoc = replaceRegex(/:TXT_URL_PARAMS/g, dictionary["urlParams"], internalDoc);
    internalDoc = replaceRegex(/:TXT_URL_NAME/g, dictionary["urlName"], internalDoc);
    internalDoc = replaceRegex(/:TXT_URL_TYPE/g, dictionary["urlType"], internalDoc);
    internalDoc = replaceRegex(/:TXT_URL_DESC/g, dictionary["urlDesc"], internalDoc);
    internalDoc = replaceRegex(/:TXT_BODY_REQUEST/g, dictionary["requestBody"], internalDoc);
    internalDoc = replaceRegex(/:TXT_BODY_PARAMETERS/g, dictionary["bodyParametersDesc"], internalDoc);
    internalDoc = replaceRegex(/:TXT_BODY_NAME/g, dictionary["bodyName"], internalDoc);
    internalDoc = replaceRegex(/:TXT_BODY_TYPE/g, dictionary["bodyType"], internalDoc);
    internalDoc = replaceRegex(/:TXT_BODY_DESC/g, dictionary["bodyDesc"], internalDoc);
    internalDoc = replaceRegex(/:TXT_RESPONSES/g, dictionary["responses"], internalDoc);
    internalDoc = replaceRegex(/:TXT_RESPONSE_CODE/g, dictionary["responseCode"], internalDoc);
    internalDoc = replaceRegex(/:TXT_RESPONSE_DESC/g, dictionary["responseDesc"], internalDoc);
    internalDoc = replaceRegex(/:TXT_RESPONSE_BODY/g, dictionary["responseBody"], internalDoc);
    return internalDoc;
}

/**
 * Replace Doc keys
 * @param {String} key
 * @param {String} value
 * @param {String} doc
 * @param {Boolean} td
 */
function replace(key, value, doc, td) {
    if (td) {
        return doc.replace("<td>:" + key + "</td>", value);
    } else {
        return doc.replace(":" + key, value);
    }
}

/**
 * Replace by regex
 * @param {String} key
 * @param {String} value
 * @param {String} doc
 */
function replaceRegex(key, value, doc) {
    return doc.replace(key, value);
}

/**
 * Create documentation
 * @param {JSON} json 
 */
function createDoc(content) {

    var json = null;
    var contentTemplate = null;
    var headerTemplate = null;
    $.getJSON("api.json").then(function (result) {
        json = result;
        if (content) {
            json = content;
        }
        return $.get("header.template.html");
    }).then(function (result) {
        headerTemplate = result;
        return $.get("content.template.html");
    }).then(function (result) {
        contentTemplate = result;
        processHeader(json, headerTemplate);
        processContent(json, contentTemplate);
    });
}

/**
 * Process Header
 * @param {JSON} json 
 * @param {String} template 
 */
function processHeader(json, template) {
    var doc = template;

    // Check locale
    if (!translates[json.locale]) {
        json.locale = translates["default"];
    }
    var dictionary = translates[json.locale];

    // Process infos
    doc = replaceRegex(/:TITLE/g, json.title, doc);
    doc = replaceRegex(/:INFO_DESC/g, json.desc, doc);
    doc = replaceRegex(/:TXT_BASE_URL/g, dictionary["baseUrl"], doc);
    doc = replaceRegex(/:INFO_BASE_URL/g, json.baseUrl, doc);
    doc = replaceRegex(/:TXT_VERSION/g, dictionary["version"], doc);
    doc = replaceRegex(/:INFO_VERSION/g, json.version, doc);
    doc = replaceRegex(/:TXT_CONTACT/g, dictionary["contact"], doc);
    doc = replaceRegex(/:INFO_CONTACT/g, json.contact, doc);
    doc = replaceRegex(/:TXT_LICENSE/g, dictionary["license"], doc);
    doc = replaceRegex(/:INFO_LICENSE_NAME/g, json.license.name, doc);
    doc = replaceRegex(/:INFO_LICENSE_URL/g, json.license.url, doc);

    // Print
    $("#header").html(doc);

    // Hide elements
    if (!json.version) {
        $("#version").hide();
    }
    if (!json.contact) {
        $("#contact").hide();
    }
    if (!json.license) {
        $("#license").hide();
    }
}

/**
 * Process Paths
 * @param {JSON} json 
 * @param {String} template 
 */
function processContent(json, template) {

    // Check locale
    if (!translates[json.locale]) {
        json.locale = translates["default"];
    }
    var dictionary = translates[json.locale];

    // Paths
    json.paths.forEach((path, index) => {
        var doc = template;

        // Section
        if (path.section) {
            doc = replace("SECTION_NAME", `<span>${path.section}</span><hr>`, doc, false);
        } else {
            doc = replace("SECTION_NAME", '', doc, false);
        }

        // Deprecated
        if (!path.deprecated) {
            doc = replace(
                "METHOD_COLOR",
                methodColors[path.method.toUpperCase()],
                doc,
                false
            );
            doc = replace("DEPRECATED_LABEL", "hide", doc, false);
        } else {
            doc = replace("METHOD_COLOR", "grey", doc, false);
            doc = replace("DEPRECATED", "deprecated", doc, false);
        }

        // Common
        doc = replace("METHOD", path.method, doc, false);
        doc = replace("PORT", path.path, doc, false);
        doc = replace("PORT_2", path.path, doc, false);
        doc = replace("PORT_TITLE", path.title, doc, false);
        doc = replace("PORT_DESC", path.desc, doc, false);
        doc = replace("ID_DETAIL", index, doc, false);
        doc = replace("ID", index, doc, false);

        // Headers
        if (path.headers) {
            var content = "";
            path.headers.forEach(header => {
                content += "<tr>";
                content += `<td>${header.name}</td>`;
                content += `<td>${header.type}</td>`;
                content += `<td>${header.desc}</td>`;
                content += "</tr>";
            });
            doc = replace("HEADER_CONTENT", content, doc, true);
        } else {
            doc = replace("HEADER", "hide", doc, false);
        }

        // URL
        if (path.urlParameters) {
            var content = "";
            path.urlParameters.forEach(parameter => {
                content += "<tr>";
                content += `<td>${parameter.name}</td>`;
                content += `<td>${parameter.type}</td>`;
                content += `<td>${parameter.desc}</td>`;
                content += "</tr>";
            });
            doc = replace("URL_CONTENT", content, doc, true);
        } else {
            doc = replace("URL", "hide", doc, false);
        }

        // Body
        if (path.body) {
            doc = replace("BODY_DESC", path.body.desc, doc, false);
            var brakeLine = "";
            if (path.body.jsonModel) {
                doc = replace("BODY_JSON_MODEL", "<span class='cyan-text'>JSON</span><br>" + JSON.stringify(path.body.jsonModel, null, '    '), doc, false);
                brakeLine = "<br>";
            } else {
                doc = replace("BODY_JSON_MODEL", '', doc, false);
            }
            if (path.body.xmlModel) {
                doc = replace("BODY_XML_MODEL", brakeLine + "<span class='cyan-text'>XML</span><br>" + parseXml(path.body.xmlModel), doc, false);
            } else {
                doc = replace("BODY_XML_MODEL", '', doc, false);
            }


            var content = "";
            path.body.parameters.forEach(parameter => {
                content += "<tr>";
                content += `<td>${parameter.name}</td>`;
                content += `<td>${parameter.type}</td>`;
                content += `<td>${parameter.desc}</td>`;
                content += "</tr>";
            });
            doc = replace("BODY_PARAMETERS", content, doc, true);
        } else {
            doc = replace("BODY", "hide", doc, false);
        }

        // Responses
        if (path.responses) {
            var content = "";
            path.responses.forEach(response => {
                content += "<tr>";
                content += `<td>${response.code}</td>`;
                content += `<td>${response.desc}</td>`;

                var brakeLine = "";
                var codeBox = "<pre class='code-box'>";
                if (response.jsonModel) {
                    codeBox += `<span class='cyan-text'>JSON</span><br>${JSON.stringify(response.jsonModel, null, '    ')}`;
                    brakeLine = "<br>";
                }
                if (response.xmlModel) {
                    codeBox += `${brakeLine}<span class='cyan-text'>XML</span><br>${parseXml(response.xmlModel)}`;
                }
                codeBox += "</pre>";
                content += `<td>${codeBox}</td>`;
                content += "</tr>";
            });
            doc = replace("RESPONSES_CONTENT", content, doc, true);
        } else {
            doc = replace("RESPONSES", "hide", doc, false);
        }

        // Process Locale
        doc = translate(doc, json.locale);

        // Print
        $("#content").append(doc);
        $("#credit").html(`${dictionary["createdBy"]}: SRestD (Simple Rest Doc)`);
    });
}

/**
 * Replace xml characteres
 * @param {String} doc 
 */
function parseXml(doc) {
    var internalDoc = doc;
    internalDoc = internalDoc.replace(/\</g, "&lt;");
    internalDoc = internalDoc.replace(/\>/g, "&gt;");
    return internalDoc;
}

/**
 * path Collapse
 * @param {Number} id
 */
function collapse(id) {
    if ($("#detail-" + id).is(":visible")) {
        $("#detail-" + id).hide();
    } else {
        $("#detail-" + id).show();
    }
}