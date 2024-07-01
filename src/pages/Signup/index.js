import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import * as C from './styles'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirmada, setSenhaConfirmada] = useState('')
  const [papel, setPapel] = useState('')
  const [error, setError] = useState('')

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [registroProf, setRegistroProf] = useState('')
  const [isUserRegistered, setIsUserRegistered] = useState(false)

  const { signup, registerPessoa } = useAuth()
  const navigate = useNavigate()

  const Private = () => {
    const { signed } = useAuth();  
    return signed > 0;
  };

  const handleSignup = async () => {
    
    if (!email || !senha || !senhaConfirmada || !papel) {
      setError('Preencha todos os campos')
      return
    }

    const res = await signup(email, senha, senhaConfirmada, papel)

    if (res) {
      setError(res)
      return
    }

    alert('Usuário cadatrado com sucesso!')
    // navigate('/')

    setIsUserRegistered(true)

  }

  const isLog = Private();

  const handleAdditionalInfoSubmit = async () => {
    // Lógica para salvar nome e CPF

    debugger
    if (!nome || !cpf && (papel === "0" && !registroProf)) {
      setError('Preencha todos os campos')
      return
    }

    const pessoa = {
      pessoaCreateRequest: {
       cpf, nome, emailUsuario: email
      }
    }

    if(papel === "0") 
      pessoa.registroConselho = registroProf

    const res = await registerPessoa(pessoa)


    if (res) {
      setError(res)
      return
    }

    alert('Pessoa cadatrada com sucesso!')
    navigate('/')
  }

  return (
    <C.Container>
      <C.Label>Improveu</C.Label>
      <C.Content>
        {!isUserRegistered ? (
          <>
            <Input
              type="email"
              placeholder="Digite seu E-mail"
              value={email}
              onChange={e => [setEmail(e.target.value), setError('')]}
            />
            <Input
              type="password"
              placeholder="Digite sua Senha"
              value={senha}
              onChange={e => [setSenha(e.target.value), setError('')]}
            />
            <Input
              type="password"
              placeholder="Confirme sua Senha"
              value={senhaConfirmada}
              onChange={e => [setSenhaConfirmada(e.target.value), setError('')]}
            />
            <div>
              <label>
                <input
                  type="radio"
                  value={0}
                  id="edFisico"
                  name="tipo-papel"
                  onChange={e => {
                    setPapel(e.target.value)
                    setError('')
                  }}
                />
                Educador Físico
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value={1}
                  id="aluno"
                  name="tipo-papel"
                  onChange={e => {
                    setPapel(e.target.value)
                    setError('')
                  }}
                />
                Aluno
              </label>
            </div>
            <C.labelError>{error}</C.labelError>
            <Button Text="Inscrever-se" onClick={handleSignup} />
            <C.LabelSignin>
              Já tem uma conta?
              <C.Strong>
                <Link to="/">&nbsp;Entre</Link>
              </C.Strong>
            </C.LabelSignin>
          </>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Digite seu Nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={e => setCpf(e.target.value)}
            />
            {papel === "0" && <Input
              type="text"
              placeholder="Digite seu numero do Registro Profissional:"
              value={registroProf}
              onChange={e => setRegistroProf(e.target.value)}
            />}
            <Button Text="Salvar" onClick={handleAdditionalInfoSubmit} />
          </>
        )}
      </C.Content>
    </C.Container>
  )
}

export default Signup
