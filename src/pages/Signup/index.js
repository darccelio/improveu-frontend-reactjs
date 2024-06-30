import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import * as C from './styles'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Signup = () => {
  const [email, setEmail] = useState('')
  // const [emailConf, setEmailConf] = useState("");
  const [senha, setSenha] = useState('')
  const [senhaConfirmada, setSenhaConfirmada] = useState('')
  const [papel, setPapel] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { signup } = useAuth()

  const handleSignup = async () => {
    // Tornar a função assíncrona
    if (!email || !senha || !senhaConfirmada || !papel) {
      // Verificar se 'papel' também está preenchido
      setError('Preencha todos os campos')
      return
    }
    // } else if (email !== emailConf) {
    //   setError("Os e-mails não são iguais");
    //   return;
    // }

    debugger
    const res = await signup(email, senha, senhaConfirmada, papel)

    if (res) {
      setError(res)
      return
    }

    alert('Usuário cadatrado com sucesso!')
    navigate('/')
  }

  return (
    <C.Container>
      <C.Label>Improveu</C.Label>
      <C.Content>
        <Input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={e => [setEmail(e.target.value), setError('')]}
        />
        {/* <Input
          type="email"
          placeholder="Confirme seu E-mail"
          value={emailConf}
          onChange={(e) => [setEmailConf(e.target.value), setError("")]}
        /> */}
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
        {/* <Input // Campo de entrada para 'papel'
          type="text"
          placeholder="Digite seu Papel"
          value={papel}
          onChange={(e) => { setPapel(e.target.value); setError(""); }}
        /> */}
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
      </C.Content>
    </C.Container>
  )
}

export default Signup
