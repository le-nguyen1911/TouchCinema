import logo from "../assets/logo.png";
const Footer = () => {
  return (
    <div>
      <footer className="px-6 pt-8 md:px-16 lg:px-36 w-full text-gray-300">
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
          <div className="md:max-w-96">
            <img alt="" className="h-11" src={logo} />
            <p className="mt-6 text-sm">
              Trải nghiệm thế giới điện ảnh đỉnh cao với những bộ phim mới nhất,
              bom tấn phòng vé và kho nội dung giải trí bất tận. Đắm chìm trong
              từng khoảnh khắc gay cấn, hài hước hay cảm động – tất cả chỉ trong
              một lần chạm.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
                alt="google play"
                className="h-10 w-auto border border-white rounded"
              />
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg"
                alt="app store"
                className="h-10 w-auto border border-white rounded"
              />
            </div>
          </div>
          <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
            <div>
              <h2 className="font-semibold mb-5">Về chúng tôi</h2>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#">Trang chủ</a>
                </li>
                <li>
                  <a href="#">Phim</a>
                </li>
                <li>
                  <a href="#">Rạp</a>
                </li>
                <li>
                  <a href="#">Yêu thích</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-5">Liên hệ với chúng tôi</h2>
              <div className="text-sm space-y-2">
                <p>0377467900</p>
                <p>lenguyen001911@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <p className="pt-4 text-center text-sm pb-5">
          Copyright {new Date().getFullYear()} ©{" "}
          <a href="https://prebuiltui.com">TouchCinema</a>. All Right Reserved.
        </p>
      </footer>
    </div>
  );
};
export default Footer;
