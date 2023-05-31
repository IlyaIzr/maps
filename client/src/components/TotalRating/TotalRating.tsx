// todo make it nonNaNorZero or smth
import { notNaN } from '~rest/helperFuncs'
import { TEXT } from '~rest/lang';
import { gradients } from '~rest/colors';
import { useSelector } from 'react-redux';
import './TotalRating.css'

type TotalRatingProps = { rating: number, amount: string | number}

function ratingData(rating: string | number) {
  return String(Number(rating).toPrecision(3)).split('.')
}

function getColor(rating: string | number, theme: string) {
  if (!rating) return gradients[theme][0]
  for (let i = 0; i < gradients[theme].length; i++) {
    if (+rating - 1 < i) return gradients[theme][i]
  }
}

export function TotalRating({ rating, amount }: TotalRatingProps) {
  const { theme } = useSelector(s => s.app)
  const color = getColor(rating, theme)

  return (
    <div className="rating">
      <div className="ratingAmount mp-border-primary relative" style={{ borderColor: color }} title={TEXT.rating}>
        {notNaN(ratingData(rating)[0])}.<span >{notNaN(ratingData(rating)[1])}</span>
        <sub className="mp-dark mp-bg-light" style={{ color: color }} title={TEXT.marks}> ( {amount} ) </sub>
      </div>
    </div>
  )
}