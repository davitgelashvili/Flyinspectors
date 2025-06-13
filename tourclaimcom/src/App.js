import logo from './logo.svg';
import './App.css';
import { Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import Form from './components/Form/Form';
import "./i18n/i18n";
import { useMemo, useRef } from 'react';
import { TermsConditions } from './components/TermsConditions/TermsConditions';

function App() {
    const [searchParams] = useSearchParams()
    const ref = searchParams.get('ref')

    return (
        <Routes>
            <Route path={`/`} element={<Form ref={ref} />} />
            <Route path={`/terms-and-conditions`} element={<TermsConditions/>} />
        </Routes>
    );
}

export default App;
