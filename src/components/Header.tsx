import "./Header.css";

export interface HeaderProps {
  opensea: string;
}

export default function Header(props: HeaderProps) {
  return (
    <header>
      <h1 className="heading gradient-text">
        <a href={props.opensea} target="_blank" rel="noreferrer">
          Polygon Squirrels
        </a>
      </h1>
      <div>
        <button className="os-button">
          <a href={props.opensea} target="_blank" rel="noreferrer">
            View Collection on Opensea
          </a>
        </button>
      </div>
    </header>
  );
}
