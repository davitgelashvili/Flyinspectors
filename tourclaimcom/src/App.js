import logo from './logo.svg';
import './App.css';
import { Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import Form from './components/Form/Form';
import "./i18n/i18n";
import { useMemo, useRef } from 'react';
import { TermsConditions } from './components/TermsConditions/TermsConditions';
import AdminPanel from './AdminPanel/AdminPanel';

function App() {
    return (
        <Routes>
            <Route path={`/`} element={<Form />} />
            <Route path={`/terms-and-conditions`} element={<TermsConditions/>} />
            <Route path={"/admin/*"} element={<AdminPanel />} />
        </Routes>
    );
}

export default App;
