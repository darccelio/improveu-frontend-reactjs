import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [er, setEr] = useState(null)

  useEffect(() => {
    const userToken = localStorage.getItem('user_token')
    const usersStorage = localStorage.getItem('users_bd')


    console.log(`userToken; ${userToken}`);
    console.log(`usersStorage; ${usersStorage}`);

    if (userToken && usersStorage) {      
      if(JSON.parse(usersStorage)?.email ===JSON.parse(userToken)?.email)
        setUser(JSON.parse(usersStorage))
    }
  }, [])


  //-----------------------------------------------------------------------------------------
  const signin = async (email, password) => {

    const URL_TO_AUTH = `https://localhost:5000/api/conta/autenticar`

    const user = {
      email: email,
      senha: password
    }  
    
    if(!user.email && !user.senha)
      return 'Preencha os campos corretamente!'

    try {

      const response = await fetch(URL_TO_AUTH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Type': 'application/json',
        },
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        // Trata a resposta não bem-sucedida (ex: erro 400 ou 500)
        const errorData = await response.json();
        setEr(errorData.message || 'Erro ao autenticar usuário');
        // return errorData.message || 'Erro ao registrar usuário';
        return;
      }

      const json = await response.json()

      if (json?.success) {
        const accessToken = json.data.accessToken
        const token = `Bearer ${accessToken}`          

        localStorage.setItem('user_token', JSON.stringify({ email, token }))
        setUser(user)
      }


    }catch (error) {
      console.error('Erro na requisição de signin:', error)
      // return error.message
      setEr(error.message || 'Erro ao autenticar usuário')
    }
    
  }

  //-----------------------------------------------------------------------------------------
  const signup = async (email, password, passwordConfirmed, papel) => {
    if (password !== passwordConfirmed) {
      return 'As senhas não coincidem';
    }
  
    const user = {
      email: email,
      papel: papel,
      senha: password,
      confirmacaoSenha: passwordConfirmed
    }  

    let isAutenticado = false;

    try {  
      const response = await fetch(
        'https://localhost:5000/api/conta/registrar',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        }
      )

      if (!response.ok) {
        // Trata a resposta não bem-sucedida (ex: erro 400 ou 500)
        const errorData = await response.json();
        setUser({...user, isAutenticado: false})
        return errorData.message || 'Erro ao registrar usuário';
      }

      const json = await response.json()
      const accessToken = json.data.accessToken
      const token = `Bearer ${accessToken}`
  
      localStorage.setItem("users_bd", JSON.stringify({ email, password, papel }));
      localStorage.setItem("user_token", JSON.stringify({ email, token }));

      setUser({ email, password, papel, isAutenticado: true});

    } catch (error) {
      console.error('Erro na requisição de signup:', error)      
      setUser({...user, isAutenticado: false})
      return error.message
    }
  }

  //-----------------------------------------------------------------------------------------

  const signout = () => {
    setUser(null)
    localStorage.removeItem('user_token')
  }

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signup, signout }}
    >
      {children}
    </AuthContext.Provider>
  )
}