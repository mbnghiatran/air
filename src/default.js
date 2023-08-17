
function execute_script_with_token(discord_token) {
    setInterval(() => {
      document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = `"${discord_token}"`
    }, 50);
    setTimeout(() => {
      location.reload();
    }, 2500);
  }

function get_element_by_xpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function scroll_into_view(element) {
    element.scrollIntoView(true);
}

function get_xpath_of_element(element) {
    if (element===document.body)
        return '//' + String(element.tagName).toLowerCase();
    var ix= 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i<siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling===element)
            return get_xpath_of_element(element.parentNode) + '/' + String(element.tagName).toLowerCase() + '['+(ix+1)+']' ;
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
            ix++ ;
    }
}

function get_element_attribute(element) {
    var items = { };
    for (index = 0; index < element.attributes.length; ++index) { 
        items[element.attributes[index].name] = element.attributes[index].value }; 
    return items;
}

function get_login_form() {
    const p = document.querySelector("[type=password]");
    if (p) {
        const f = p.form;
        if (f) {
            const u = f.querySelector("input:not([type=password])");
            if (u){
                b = f.querySelector("[type=submit]");
                return {
                    'form': {'xpath': get_xpath_of_element(f), 'element': f},
                    'username': {'xpath': get_xpath_of_element(u), 'element': u},
                    'password': {'xpath': get_xpath_of_element(p), 'element': p},
                    'submit_button': {'xpath' : get_xpath_of_element(b), 'element': b},
                }
            }               
        }
    }
    return { };
}

