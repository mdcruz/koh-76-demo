import http from 'k6/http'

export function testSetup() {
  const login = {
    "username": "admin",
    "password": "password"
  }

  const res = http.get('https://automationintesting.online/message/')

  const filteredQuery = res.json().messages.filter(message => message.name == 'Marie')

  if (filteredQuery.length < 0) return

  http.post('https://automationintesting.online/auth/login', JSON.stringify(login), {
    headers: { 'Content-Type': 'application/json' },
  });

  for (let i = 0; i < filteredQuery.length; i++) {
    const res = http.del(`https://automationintesting.online/message/${filteredQuery[i].id}`, null)
    console.log(res.status)

    if(res.status == 202) {
      console.log(`https://automationintesting.online/message/${filteredQuery[i].id} deleted`)
    }
  }
}