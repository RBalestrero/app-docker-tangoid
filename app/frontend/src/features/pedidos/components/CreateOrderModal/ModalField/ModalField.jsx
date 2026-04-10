import styles from './ModalField.module.css';

function ModalField({
  label,
  required = false,
  type = 'text',
  as = 'input',
  value,
  onChange,
  options = [],
  rows = 3,
  placeholder = '',
  colClassName = 'col-md-3',
  inputClassName = '',
  ...rest
}) {
  const labelText = required ? `${label} *` : label;
  const controlClassName =
    as === 'select'
      ? `form-select form-select-sm ${styles.control} ${inputClassName}`.trim()
      : `form-control form-control-sm ${styles.control} ${inputClassName}`.trim();

  return (
    <div className={colClassName}>
      <label className={`form-label ${styles.label}`}>{labelText}</label>

      {as === 'select' ? (
        <select
          className={controlClassName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        >
          {options.map((option) => {
            const optionValue =
              typeof option === 'object' ? option.value : option;
            const optionLabel =
              typeof option === 'object' ? option.label : option;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          className={controlClassName}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      ) : (
        <input
          type={type}
          className={controlClassName}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      )}
    </div>
  );
}

export default ModalField;