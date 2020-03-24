const Validate = require('./Validate')

var post = []
post['nome'] = 'Nome completo do usuário'
post['link'] = 'www.enderecodosite.com.br'
post['email'] = 'endereco@email.com'
post['num'] = 1
post['data'] = '01/01/2002' // eu: dd/mm/YYYY us: YYYY-mm-dd
// post['check'] = [1] : Em andamento

arrMsg = []
arrMsg = ValidateTeste(post)
const mensagens = vld.setMessage(arrMsg, true)

if ( mensagens.length > 0 )
console.log('Atenção: '+mensagens)
else
console.log('Sem erros')


function ValidateTeste(post) {
    let arrMsg = []
    vld = new Validate()
    vld.add_text_field('Texto', post['nome'], 'text', 1, 120)
    vld.add_link_field('Link', post['link'], 'url', 1)
    vld.add_link_field('E-mail', post['email'], 'email', 1)
    vld.add_num_field('Num', post['num'], 'number', 1, 1)
    vld.add_date_field('DATA', post['data'], 'date', 'eu', 1)
    // vld.add_check_box('Opções Checkbox', post['check'], 'checkbox')
 
    if (!vld.validation()) {
        arrMsg = vld.createMessage()
    }
    return arrMsg
}