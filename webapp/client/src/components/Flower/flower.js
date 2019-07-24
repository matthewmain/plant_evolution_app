import React from 'react'

const Flower = (props) => {

  return (
    <div className="flower">
      <svg
        id="flower_avatar"
        alt="flower avatar"
        style={{
          maxWidth: `${props.appState.username ? props.size+"px" : "0px"}`,
          paddingRight: `${props.appState.username ? "0px" : "12px"}`,
        }}
        width={props.size+'px'} height={props.size+'px'} viewBox="0 0 43 49" version="1.1" xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="page-header-right" transform="translate(-41.000000, -1.000000)" fillRule="nonzero">
            <g id="header-right">
              <g id="header-right-(logged-in,-closed)">
                <g id="avatar" transform="translate(37.000000, 0.000000)">
                  <g id="flower-avatar" transform="translate(4.000000, 1.000000)">
                    <polygon id="hex"
                      fill={props.appState.avatar ? props.appState.avatar.colors.pistil : "#E0993E"} points="25.1 17.2 29.2 24.0996728 25.2 31 17.1 31.1 13 24.0996728 17 17.3044867"></polygon>
                    <path id="petals"
                      fill={props.appState.avatar ? props.appState.avatar.colors.petal : "#0E7FD9"} d="M17.1278935,17.3044867 C13.7293999,10.6254606 15.0510363,4.85729839 21.0928027,0 C27.134569,4.85729839 28.4562054,10.6254606 25.0577118,17.3044867 L17.1278935,17.3044867 Z M25.0577118,17.3044867 C29.2041618,11.052751 34.9134596,9.30120091 42.1856053,12.0498364 C40.955226,19.6557703 36.5675645,23.6723824 29.022621,24.0996728 L25.0577118,17.3044867 Z M29.022621,24.0996728 C36.5675645,24.5269632 40.955226,28.5435753 42.1856053,36.1495092 C34.9134596,38.8981447 29.2041618,37.1465946 25.0577118,30.8948589 L29.022621,24.0996728 Z M25.0577118,30.8948589 C28.4562054,37.573885 27.134569,43.3420472 21.0928027,48.1993456 C15.0510363,43.3420472 13.7293999,37.573885 17.1278935,30.8948589 L25.0577118,30.8948589 Z M17.1278935,30.8948589 C12.9814436,37.1465946 7.27214573,38.8981447 2.84217094e-14,36.1495092 C1.23037938,28.5435753 5.61804082,24.5269632 13.1629843,24.0996728 L17.1278935,30.8948589 Z M13.1629843,24.0996728 C5.61804082,23.6723824 1.23037938,19.6557703 1.10134124e-13,12.0498364 C7.27214573,9.30120091 12.9814436,11.052751 17.1278935,17.3044867 L13.1629843,24.0996728 Z"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )

}

export default Flower
