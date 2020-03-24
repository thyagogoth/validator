/**
* Classe para Validação de dados
*/
module.exports = class Validate {
    constructor() {
        this.messages = []
        this.fields = []
        this.the_msg = []
        this.createMessage()
        this.count = 0
        this.url_pattern
    }
    
    validation() {
        this.status = 0
        this.fields.forEach(val => {
            switch( val['type'] ) {
                case 'email':
                if (!this.check_email(val['value'], val, val['required'])) {
                    this.status++
                }
                break
                case 'number':
                if (!this.check_num_val(val['value'], val, val['length'], val['required'])) {
                    this.status++
                }
                break
                case 'decimal':
                if (!this.check_num_val(val['value'], val, val['decimals'], val['required'])) {
                    this.status++
                }
                break
                case 'date':
                if (!this.check_date(val['value'], val, val['version'], val['required'])) {
                    this.status++;
                }
                break
                case 'url':
                if (!this.check_url(val['value'], val, val['required'])) {
                    this.status++
                }
                break
                case 'text':
                if (!this.check_text(val['value'], val, val['length'], val['required'])) {
                    this.status++;
                }
                break
                case 'password':
                if (!this.check_senha(val['senha1'], val['senha2'], val['required'])) {
                    this.status++
                }
                break
                case 'checkbox':
                case 'radio':
                    if (!this.check_check_box(val['value'], val, val['element'])) {
                        this.status++
                    }
                break
                }
        })
        
    }
    
    createMessage() {
        this.messages.forEach( value => {
            this.the_msg.push(value)
        })
        return this.the_msg
    }
    
    errorText(num, fieldname = "") {
        this.msg = []
        this.msg[0] = ['Por favor, verifique as seguintes informações:']
        this.msg[1] = ['O campo <strong>' + fieldname.name + '</strong> é obrigatório.']
        this.msg[10] = ['A data no campo <strong>' + fieldname.name + '</strong> é inválida.']
        this.msg[11] = ['O <strong>' + fieldname.name + '</strong> é inválido.']
        this.msg[12] = ['O valor no campo <strong>' + fieldname.name + '</strong> é inválido.']
        this.msg[13] = ['O texto no campo <strong>' + fieldname.name + '</strong> é muito longo.']
        this.msg[14] = ['A url no campo <strong>' + fieldname.name + '</strong> é inválido.']
        this.msg[15] = ['Há código HTML no campo <strong>' + fieldname.name + '</strong> que não são permitidos.']
        this.msg[16] = ['As <strong>' + fieldname.name + '</strong> não conferem.']
        return this.msg[num]
    }
    
    /**
    * Métodos para validação
    */
    add_link_field(name, val, type = 'email', required = 1) {
        // this.count = this.count++
        this.fields.push({
            'name': name,
            'value': val,
            'type': type,
            'required': required
        })
    }
    
    add_senha_field(senha1, senha2) {
        if (senha1 != senha2) {
            let field = { 'name': 'Senhas'}
            this.pushMessage(16, field)
            return false;
        } else {
            return true;
        }
    }
    
    add_text_field(name, val, type = 'text', required = 1, length = 0) {
        // this.count = this.count++
        this.fields.push({
            'name': name,
            'value': val,
            'type': type,
            'required': required,
            'length' : length
        })
    }
    
    add_num_field(name, val, type='number', required=1, decimals = 0, length) {
        this.fields.push({
            'name': name,
            'value': val,
            'type': type,
            'required': required,
            'decimals': decimals,
            'length' : length
        })
    }
    
    add_date_field(name, val, type = "date", version = "us", required = 1) {
        this.fields.push({
            'name': name,
            'value': val,
            'type': type,
            'version': version,
            'required': required
        })
	}

    add_check_box(name, element_name, type = "checkbox", required_value = "") {
        this.fields.push({
            'name': name,
            'value': required_value,
            'type': type,
            'element': element_name
        })
    }
    
    check_text(text_val, field, text_len = 0, required = 1) {
        if (text_val == undefined || text_val == '') {
            if (required == 1) {
                this.pushMessage(1, field)
                return false
            } else {
                return true // in case only the text length is validated
            }
        } else {
            if (text_len > 0) {
                if (text_val.length > text_len) {
                    this.pushMessage(13, field)
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        }
    }
    
    check_email(mail_address, field, required = 1) {
        if (mail_address == "" || mail_address == undefined) {
            if (required == 1) {
                this.pushMessage(1, field)
                return false
            } else {
                return true
            }
        } else {
            if (!validateEmail(mail_address)) {
                this.pushMessage(11, field)
                return false
            } else {
                return true
            }
        }
    }
    
    check_url(url_val, field, required=1) {
        if (url_val == "" || url_val == undefined) {
            if (required == 1) {
                this.pushMessage(1, field)
                return false
            } else {
                return true
            }
        } else {
            if (!validateURL(url_val)) {
                this.pushMessage(14, field)
                return false
            }
        }
    }
    
    check_num_val(num_val, field, num_len = 0, required = 1) {
        if (num_val == "" || num_val == undefined) {
            if (required == 1) {
                this.pushMessage(1, field)
                return false
            } else {
                return true
            }
        } else {
            let er = /^[0-9,.]+$/
            if (er.test(num_val)) {
                return true
            } else {
                this.pushMessage(12, field)
                return false
            }
        }
    }
    
    check_date(date, field, version = "us", required = 1) { 
        if (date == "" || date == undefined) {
            if (required == 1) {
                this.pushMessage(1, field)
                return false
            } else {
                return true
            }
        } else {
            let pattern = ''
            let date_parts = (version == 'eu') ? date.split('/') : date.split('-')
            let month = date_parts[1]
            let day, year, checkDate
            if (version == "eu") {
                pattern = /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/
                day = date_parts[0]
                year = date_parts[2]
            } else {
                pattern = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
                day = date_parts[2]
                year = date_parts[0]
            }
            checkDate = checkdate(intval(month), intval(day), year)
            if (preg_match(pattern, date) && checkDate ) {
                return true
            } else {
                this.pushMessage(10, field)
                return false
            }
        }
    }

    check_check_box(req_value, field, element) {
		if (element == '' || element == undefined ) {
            this.pushMessage(12, field)
			return false
		} else {
			if (req_value != undefined && req_value != '') {
				if (req_value != element) {
                    this.pushMessage(12, field)
					return false
				} else {
					return true
				}
			} else {
				return true
			}
		}
	}
    
    setMessage(arrMsg, marker = false) {
        this.retorno = []
        let marcador = ''
        if (marker == true ) {
            marcador = '<i class="fa fa-warning"></i> '
        }
        if (arrMsg.length > 0) {
            arrMsg.forEach(val => {
                this.retorno += '<p>' + marcador + val + '</p>'
            })
        }
        return this.retorno
    }
    
    pushMessage(code, field) {
        this.messages.push(this.errorText(code, field))
    }
}

function validateURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function validateEmail(mail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
}

function checkdate (m, d, y) {
    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0))
    .getDate()
}

function preg_match (regex, str) {
    return (new RegExp(regex).test(str))
}

function intval(value) {
    return parseInt(value)
}