import { useEffect, useRef, useState, useCallback } from 'react'

const TITLES = [
  'Pergunte qualquer coisa sobre seus estudos',
  'No que posso te ajudar a aprender hoje?',
  'Pergunte sobre qualquer matéria ou conceito',
  'Precisa entender melhor algum assunto?',
  'Posso explicar, resumir ou resolver exercícios',
  'Diga o que você está estudando',
  'Qual matéria você quer dominar hoje?',
]

export function useRandomTitle() {
  const getRandomTitle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * TITLES.length)
    return TITLES[randomIndex]
  }, [])

  return {
    getRandomTitle,
  }
}
