import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import CustomModal from '../Modal';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { ONG } from '../AllONGs';

interface TableProps {
  rows: ONG[];
}

const Table: React.FC<TableProps> = ({ rows }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [cityFilter, setCityFilter] = React.useState('');
  const [areaFilter, setAreaFilter] = React.useState('');
  const [selectedOng, setSelectedOng] = React.useState<ONG | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [images, setImages] = React.useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImages: { [key: string]: string } = {};
      for (const row of rows) {
        const fileName = `${row.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `images/${fileName}`);
        try {
          const url = await getDownloadURL(storageRef);
          newImages[row.name] = url;
        } catch (error) {
          newImages[row.name] = ''; // No URL means show default icon
        }
      }
      setImages(newImages);
    };

    fetchImages();
  }, [rows]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (ong: ONG) => {
    setSelectedOng(ong);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filteredRows = rows.filter(row => {
    const matchesCity = cityFilter === '' || row.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesArea = areaFilter === '' || row.area.toLowerCase() === areaFilter.toLowerCase();
    return matchesCity && matchesArea;
  });

  const cities = Array.from(new Set(rows.map(row => row.city)));
  const areas = Array.from(new Set(rows.map(row => row.area)));

  return (
    <Root>
      <CustomModal
        open={openModal}
        onClose={handleCloseModal}
        ong={selectedOng}
        imageUrl={selectedOng ? images[selectedOng.name] : ''}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControlStyled variant="outlined" size="small" fullWidth>
            <InputLabel id="city-filter-label">Cidade</InputLabel>
            <Select
              labelId="city-filter-label"
              id="city-filter"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value as string)}
              label="Cidade"
            >
              <MenuItem value="">Todas</MenuItem>
              {cities.map(city => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControlStyled>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlStyled variant="outlined" size="small" fullWidth>
            <InputLabel id="area-filter-label">Área de atuação</InputLabel>
            <Select
              labelId="area-filter-label"
              id="area-filter"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value as string)}
              label="Área de atuação"
            >
              <MenuItem value="">Todos</MenuItem>
              {areas.map(area => (
                <MenuItem key={area} value={area}>{area}</MenuItem>
              ))}
            </Select>
          </FormControlStyled>
        </Grid>
      </Grid>

      <TableContainer>
        <StyledTable aria-label="custom pagination table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Área de atuação</th>
              <th>Contato</th>
            </tr>
          </thead>
          <tbody>
            {(rowsPerPage > 0
              ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredRows
            ).map((row, index) => (
              <tr key={index} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                <td>
                  {images[row.name] ? (
                    <img
                      src={images[row.name]}
                      alt={row.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageNotSupportedIcon style={{ width: '50px', height: '50px', color: '#ccc' }} />
                  )}
                </td>
                <td>{row.name}</td>
                <td>{row.description}</td>
                <td>{row.city}</td>
                <td>{row.state}</td>
                <td>{row.area}</td>
                <td>{row.contact}</td>
              </tr>
            ))}

            {emptyRows > 0 && (
              <tr style={{ height: 34 * emptyRows }}>
                <td colSpan={7} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <CustomTablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'Todas', value: -1 }]}
                colSpan={7}
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    'aria-label': 'Linhas por página',
                  },
                  actions: {
                    showFirstButton: true,
                    showLastButton: true,
                    slots: {
                      firstPageIcon: FirstPageRoundedIcon,
                      lastPageIcon: LastPageRoundedIcon,
                      nextPageIcon: ChevronRightRoundedIcon,
                      backPageIcon: ChevronLeftRoundedIcon,
                    },
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </tr>
          </tfoot>
        </StyledTable>
      </TableContainer>
    </Root>
  );
}

// ESTILOS

const blue = {
  50: '#F0F7FF',
  200: '#A5D8FF',
  400: '#3399FF',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Root = styled('div')(
  ({ theme }) => `
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 98%;
  margin: 0 auto;
  `,
);

const TableContainer = styled('div')(
  ({ theme }) => `
  overflow-x: auto;
  width: 100%;
  margin-top: 10px;
  `,
);

const StyledTable = styled('table')(
  ({ theme }) => `
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 0.875rem;
  border-collapse: collapse;
  border: none;
  width: 100%;
  padding: 10px;

  td,
  th {
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    text-align: left;
    padding: 8px;
  }
  `,
);

const CustomTablePagination = styled(TablePagination)(
  ({ theme }) => `
  & .${classes.spacer} {
    display: none;
  }

  & .${classes.toolbar}  {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 0;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.select}{
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    padding: 2px 0 2px 4px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 6px; 
    background-color: transparent;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition: all 100ms ease;

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }

    &:focus {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      border-color: ${blue[400]};
    }
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.actions} {
    display: flex;
    gap: 6px;
    border: transparent;
    text-align: center;
  }

  & .${classes.actions} > button {
    display: flex;
    align-items: center;
    padding: 0;
    border: transparent;
    border-radius: 50%;
    background-color: transparent;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition: all 120ms ease;

    > svg {
      font-size: 22px;
    }

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }

    &:focus {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      border-color: ${blue[400]};
    }

    &:disabled {
      opacity: 0.3;
      &:hover {
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
        background-color: transparent;
      }
    }
  }
  `,
);

const FormControlStyled = styled(FormControl)({
  height: '100%',
  marginTop: '10px'
});

export default Table;
