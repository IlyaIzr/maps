import { TEXT } from "../rest/lang";

export const TagItem = ({ tagInfo, onClick }) => {
  if (!tagInfo) return null;

  function click() {
    onClick(tagInfo.tag)
  }

  return (
    <div className="tagItem cursor-pointer mp-accent-hover transition-small" onClick={click}>

      <div className="mp-dark bigHashtag">
        #
      </div>

      <div className="resultTags">
        <p className="mp-secondary">{tagInfo.tag}</p>
        <p>{TEXT.tagsAmount}: <span>{tagInfo.amount}</span></p>
      </div>
    </div>
  )
}
