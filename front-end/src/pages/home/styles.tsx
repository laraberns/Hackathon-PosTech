import { styled } from "@mui/material";

export const Container = styled('div')({
    alignItems: 'center',
    height: '100%',
    padding: '10px',
    borderRadius: '5px',
    maxWidth: '80vw',
    margin: '0 auto'
});

export const Search = styled('div')({
    width: '100%',
    height: '100%'
});

export const StyledInput = styled('input')({
    width: '80%',
    margin: '0 auto',
    display: 'block',
    marginBottom: '20px',
    padding: '10px',
    border: 'solid 1px #B0B8C4',
    borderRadius: '8px',
    outline: 'none',
});

export const Title = styled('h1')({
    fontSize: '20px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    textAlign: 'center',
    marginBottom: '20px',
});
