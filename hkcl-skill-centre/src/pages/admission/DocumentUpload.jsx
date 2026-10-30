import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AdmissionLayout from '../../components/admission/AdmissionLayout.jsx';
import FormActions from '../../components/admission/FormActions.jsx';
import DocumentUploader from '../../components/admission/DocumentUploader.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function DocumentUpload() {
  const navigate = useNavigate();
  const { application, updateDocuments, isLocked } = useAdmission();

  const [documents, setDocuments] = useState({
    photo: application.documents?.photo || null,
    signature: application.documents?.signature || null,
    idProof: application.documents?.idProof || null,
  });

  const [errors, setErrors] = useState({});

  // Sync state when application.documents updates (e.g. from Auto-Fill)
  useEffect(() => {
    if (application.documents) {
      setDocuments({
        photo: application.documents.photo || null,
        signature: application.documents.signature || null,
        idProof: application.documents.idProof || null,
      });
    }
  }, [application.documents]);

  const validate = () => {
    const errs = {};
    if (!documents.photo) {
      errs.photo = 'Passport photograph is required.';
    }
    if (!documents.signature) {
      errs.signature = 'Signature is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (isLocked) {
      navigate('/admission/review');
      return;
    }
    if (!validate()) return;
    updateDocuments(documents);
    navigate('/admission/review');
  };

  return (
    <AdmissionLayout
      title="Upload Documents"
      currentStep={3}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} noValidate className="space-y-4">
        {/* Passport Photo */}
        <DocumentUploader
          id="photo"
          label="Passport Photograph"
          description="Clear photo with light background for your HKCL student certificate and ID."
          required
          acceptedTypes={['image/jpeg', 'image/png']}
          acceptedExtensionsLabel="JPG, PNG"
          maxSizeMB={2}
          previewType="avatar"
          fileData={documents.photo}
          onFileSelect={(fileObj) => {
            setDocuments((prev) => ({ ...prev, photo: fileObj }));
            setErrors((prev) => ({ ...prev, photo: '' }));
          }}
          onFileRemove={() => {
            setDocuments((prev) => ({ ...prev, photo: null }));
          }}
          error={errors.photo}
          disabled={isLocked}
        />

        {/* Specimen Signature */}
        <DocumentUploader
          id="signature"
          label="Specimen Signature"
          description="Sign on plain white paper and upload a clear photo or scan."
          required
          acceptedTypes={['image/jpeg', 'image/png']}
          acceptedExtensionsLabel="JPG, PNG"
          maxSizeMB={1}
          previewType="signature"
          fileData={documents.signature}
          onFileSelect={(fileObj) => {
            setDocuments((prev) => ({ ...prev, signature: fileObj }));
            setErrors((prev) => ({ ...prev, signature: '' }));
          }}
          onFileRemove={() => {
            setDocuments((prev) => ({ ...prev, signature: null }));
          }}
          error={errors.signature}
          disabled={isLocked}
        />

        {/* Identity Proof (Optional) */}
        <DocumentUploader
          id="idProof"
          label="Identity Proof (Aadhaar / Student ID)"
          description="Optional: Helps expedite verification at the centre."
          required={false}
          acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
          acceptedExtensionsLabel="PDF, JPG, PNG"
          maxSizeMB={2}
          previewType="document"
          fileData={documents.idProof}
          onFileSelect={(fileObj) => {
            setDocuments((prev) => ({ ...prev, idProof: fileObj }));
          }}
          onFileRemove={() => {
            setDocuments((prev) => ({ ...prev, idProof: null }));
          }}
          disabled={isLocked}
        />

        {/* Actions */}
        {isLocked ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => navigate('/admission/educational-details')}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back: Educational Details</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admission/review')}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
            >
              <span>View Application Review</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <FormActions
            backPath="/admission/educational-details"
            backLabel="Back"
            nextLabel="Continue to Review"
            onNext={handleNext}
          />
        )}
      </form>
    </AdmissionLayout>
  );
}
