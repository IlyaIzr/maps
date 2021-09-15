import { TEXT } from "../rest/lang";

export const TagItem = ({ tagInfo, onClick }) => {
  if (!tagInfo) return null;

  function click() {
    onClick(tagInfo.tag)
  }

  return (
    <div className="tagItem cursor-pointer mp-accent-hover transition-small mp-border-dark " onClick={click}>

      <div className="mp-dark tagWrap">
        <span className="bigHashtag"># </span>
        <span className="tagContent mp-accent">{tagInfo.tag}</span>
      </div>


      <p className="tagAmount mp-dark">{TEXT.tagsAmount}: <span className="mp-accent">{tagInfo.amount}</span></p>
    </div>
  )
}
