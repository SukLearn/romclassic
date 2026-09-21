export type AppLanguage = "English" | "Georgian";

export const languageEvent = "furniture-shop-language";

// Keep Georgian wording here so it can be reviewed and corrected without
// changing the page components.
const georgian: Record<string, string> = {
  Dashboard: "მთავარი",
  Products: "პროდუქტები",
  Inventory: "მარაგი",
  Sales: "გაყიდვები",
  Reservations: "ჯავშნები",
  "Reserved": "დაჯავშნილი",
  "Selling date": "გაყიდვის თარიღი",
  "Waiting for import": "შემოტანის მოლოდინში",
  "Complete the product's pending reserved sales before archiving it":
    "პროდუქტის დაარქივებამდე დაასრულეთ მისი მომლოდინე დაჯავშნილი გაყიდვები",
  "Complete or cancel the product's pending reservations before archiving it":
    "პროდუქტის დაარქივებამდე დაასრულეთ ან გააუქმეთ მისი მიმდინარე ჯავშნები",
  "Describe product": "პროდუქტის აღწერა",
  "Select warehouse first": "ჯერ აირჩიეთ საწყობი",
  "No products available to transport":
    "გადასატანად ხელმისაწვდომი პროდუქტი არ არის",
  "No products available for this action":
    "ამ მოქმედებისთვის ხელმისაწვდომი პროდუქტი არ არის",
  "Product reserved successfully.": "პროდუქტი წარმატებით დაიჯავშნა.",
  "Inventory action saved successfully.":
    "მარაგის მოქმედება წარმატებით ჩაიწერა.",
  "Product described with quantity 0. It can now be marked as sold.":
    "პროდუქტი აღწერილია 0 რაოდენობით. ახლა შესაძლებელია მისი გაყიდულად მონიშვნა.",
  Payments: "გადახდები",
  Deliveries: "მიწოდებები",
  Customers: "მომხმარებლები",
  "Customer details": "მომხმარებლის დეტალები",
  "Customer details saved successfully.":
    "მომხმარებლის დეტალები წარმატებით განახლდა.",
  "Customer modification history": "მომხმარებლის ცვლილებების ისტორია",
  "No customer changes recorded.": "მომხმარებლის ცვლილებები არ არის.",
  "Surname (optional)": "გვარი (არასავალდებულო)",
  Surname: "გვარი",
  Phone: "ტელეფონი",
  "Nationality (optional)": "ეროვნება (არასავალდებულო)",
  Nationality: "ეროვნება",
  "Total amount spent": "სულ დახარჯული თანხა",
  "Total discount received": "სულ მიღებული ფასდაკლება",
  "Outstanding debt": "დარჩენილი დავალიანება",
  "Active reservation balance": "აქტიური ჯავშნების დარჩენილი თანხა",
  "Last purchase date": "ბოლო შეძენის თარიღი",
  "Last purchased item": "ბოლოს შეძენილი პროდუქტი",
  "Purchase history": "შესყიდვების ისტორია",
  "Reservation history": "ჯავშნების ისტორია",
  "Delivery Date": "მიწოდების თარიღი",
  "Delivery Status": "მიწოდების სტატუსი",
  "Payment Method": "გადახდის მეთოდი",
  Total: "ჯამი",
  Suppliers: "მომწოდებლები",
  Showroom: "შოურუმი",
  Warehouses: "საწყობები",
  Galovani: "გალოვანი",
  Isani: "ისანი",
  "Import / export": "შემოტანა / გატანა",
  Warehouse: "საწყობი",
  "Stock status": "მარაგის სტატუსი",
  "Galovani Stock": "გალოვანის მარაგი",
  "Galovani Products": "გალოვანის პროდუქტები",
  "Isani Stock": "ისანის მარაგი",
  "Isani Products": "ისანის პროდუქტები",
  "Showroom Stock": "შოურუმის მარაგი",
  "Showroom Products": "შოურუმის პროდუქტები",
  "Products from supplier": "მომწოდებლის პროდუქტები",
  Actions: "მოქმედებები",
  Contacts: "კონტაქტები",
  History: "ისტორია",
  Reports: "ანგარიშები",
  Employees: "თანამშრომლები",
  Settings: "პარამეტრები",
  Other: "სხვა",
  Menu: "მენიუ",
  "Sign out": "გასვლა",
  "Sign in": "შესვლა",
  Username: "მომხმარებლის სახელი",
  Password: "პაროლი",
  "Restoring your session…": "სესიის აღდგენა…",
  "Shop Name": "მაღაზიის სახელი",
  Theme: "თემა",
  Language: "ენა",
  English: "ინგლისური",
  Georgian: "ქართული",
  Dark: "შავი",
  White: "თეთრი",
  Obsidian: "ობსიდიანი",
  Save: "შენახვა",
  "Settings saved": "პარამეტრები შენახულია",
  "Password changed successfully.": "პაროლი წარმატებით შეიცვალა.",
  "Password reset successfully.": "პაროლი წარმატებით განახლდა.",
  "Password must contain at least 8 characters.":
    "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.",
  "New password must contain at least 8 characters.":
    "ახალი პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.",
  "New password and confirmation must match.":
    "ახალი პაროლი და მისი დადასტურება უნდა ემთხვეოდეს.",
  "New password must be different from the old password":
    "ახალი პაროლი ძველი პაროლისგან განსხვავებული უნდა იყოს",
  "Current password is incorrect": "მიმდინარე პაროლი არასწორია",
  "Confirm the new password:": "დაადასტურეთ ახალი პაროლი:",
  "Change password": "პაროლის შეცვლა",
  "Current password": "მიმდინარე პაროლი",
  "New password": "ახალი პაროლი",
  "Confirm new password": "გაიმეორეთ ახალი პაროლი",
  "Reset password": "პაროლის განახლება",
  "At least 3 characters.": "მინიმუმ 3 სიმბოლო.",
  "At least 8 characters.": "მინიმუმ 8 სიმბოლო.",
  Loading: "იტვირთება",
  "Loading...": "იტვირთება...",
  "Loading…": "იტვირთება…",
  Period: "პერიოდი",
  Month: "თვე",
  Quarter: "კვარტალი",
  Year: "წელი",
  "Total Revenue": "შემოსავალი",
  "Imported product cost": "შემოტანილი პროდუქციის ღირებულება",
  "Financial loss": "ფინანსური დანაკარგი",
  "Returned products": "დაბრუნებული პროდუქტები",
  "Returned / refunded": "დაბრუნებული",
  "In transit": "გზაშია",
  "Paid / closed sales": "დახურული გაყიდვები",
  "Most returned product": "ყველაზე ხშირად დაბრუნებული პროდუქტი",
  "Most sold product": "ყველაზე გაყიდვადი პროდუქტი",
  "Supplier Revenue": "მომწოდებლის შემოსავალი",
  Supplier: "მომწოდებელი",
  Product: "პროდუქტი",
  "Movement type": "მოძრაობის ტიპი",
  Status: "სტატუსი",
  From: "დან",
  To: "მდე",
  All: "ყველა",
  ACTIVE: "აქტიური",
  REVERSED: "გაუქმებული",
  CHANGED: "შეცვლილი",
  READY: "მზადაა",
  IN_TRANSIT: "გზაშია",
  CANCELLED: "გაუქმებულია",
  COMPLETED: "დასრულებულია",
  RETURNED: "დაბრუნებულია",
  PARTIALLY_RETURNED: "ნაწილობრივ დაბრუნებულია",
  OUTSTANDING: "დარჩენილი",
  Outstanding: "დარჩენილი",
  PAID: "გადახდილია",
  Paid: "გადახდილი",
  UNPAID: "გადაუხდელი",
  PARTIALLY_PAID: "ნაწილობრივ გადახდილი",
  Show: "ჩვენება",
  "Total Outstanding": "სულ დარჩენილი",
  "Sale ID": "გაყიდვის ID",
  "Sale details": "გაყიდვის დეტალები",
  "Sale #": "გაყიდვა #",
  "Sale date": "გაყიდვის თარიღი",
  Date: "თარიღი",
  Customer: "მომხმარებელი",
  Contact: "კონტაქტი",
  Address: "მისამართი",
  Delivery: "მიწოდება",
  "In Transit": "გზაში",
  Delivered: "მიწოდებულია",
  "Payment Status": "გადახდის სტატუსი",
  "Payment status": "გადახდის სტატუსი",
  "Customer ID": "მომხმარებლის ID",
  "Product ID": "პროდუქტის ID",
  "Delivery status": "მიწოდების სტატუსი",
  "Delivery address": "მიწოდების მისამართი",
  "Delivery date": "მიწოდების თარიღი",
  "Original unit price": "ერთეულის საწყისი ფასი",
  "Discount per unit": "ფასდაკლება ერთეულზე",
  "Discount total": "ფასდაკლების ჯამი",
  "Purchase cost per unit": "ერთეულის შესყიდვის ღირებულება",
  "Cost total": "თვითღირებულების ჯამი",
  "Returned value": "დაბრუნებული ღირებულება",
  Returned: "დაბრუნებული",
  Returns: "დაბრუნებები",
  Refunded: "ანაზღაურებული",
  Refunds: "ანაზღაურებები",
  Amount: "თანხა",
  None: "არცერთი",
  "Sale Total": "გაყიდვის ჯამი",
  Remaining: "დარჩენილი",
  Action: "მოქმედება",
  "Complete sale": "გაყიდვის დასრულება",
  Quantity: "რაოდენობა",
  "Final unit price": "ერთეულის საბოლოო ფასი",
  "Regular unit price": "ერთეულის სტანდარტული ფასი",
  "Customer discount per unit": "მომხმარებლის ფასდაკლება ერთეულზე",
  "Sale total": "გაყიდვის ჯამი",
  "Payment method": "გადახდის მეთოდი",
  "Paid now": "მომხ გადახდილი",
  Notes: "შენიშვნები",
  CASH: "ნაღდი",
  CARD: "ბარათი",
  BANK_TRANSFER: "საბანკო გადარიცხვა",
  OTHER: "სხვა",
  Name: "სახელი",
  Category: "კატეგორია",
  "Select category": "აირჩიეთ კატეგორია",
  Invoice: "ინვოისი",
  "Invoice code": "ინვოისის კოდი",
  "All invoice codes": "ყველა ინვოისის კოდი",
  "Imported quantity": "შემოტანილი რაოდენობა",
  "Remaining on invoice": "დარჩენილი რაოდენობა",
  "+ New invoice": "+ ახალი ინვოისი",
  "New invoice code": "ახალი ინვოისის კოდი",
  "Type or choose a code": "ჩაწერეთ კოდი",
  "+ New product": "+ ახალი პროდუქტი",
  "Category Management": "კატეგორიების მართვა",
  "Category name": "კატეგორიის სახელი",
  "Create category": "კატეგორიის შექმნა",
  "Invoice Code Management": "ინვოისის კოდების მართვა",
  "Create invoice code": "ინვოისის კოდის შექმნა",
  "Invoice code created successfully.": "ინვოისის კოდი წარმატებით შეიქმნა.",
  "Invoice code renamed successfully.": "ინვოისის კოდი წარმატებით შეიცვალა.",
  "Invoice code deleted successfully.": "ინვოისის კოდი წარმატებით წაიშალა.",
  "Category created successfully.": "კატეგორია წარმატებით შეიქმნა.",
  "Category renamed successfully.": "კატეგორიის სახელი წარმატებით შეიცვალა.",
  "Category deleted successfully.": "კატეგორია წარმატებით წაიშალა.",
  "Invoice Contains Products, It can't be DELETED":
    "ინვოისი შეიცავს პროდუქტებს და მისი წაშლა შეუძლებელია",
  "Clear filters": "გასუფთავება",
  "Show records": "ჩანაწერების ჩვენება",
  "Sort by": "დალაგება",
  "Original order": "საწყისი თანმიმდევრობა",
  Ascending: "ზრდადობით",
  Descending: "კლებადობით",
  Previous: "წინა",
  Next: "შემდეგი",
  "Table pagination": "ცხრილის გვერდები",
  "Minimum price": "მინიმალური ფასი",
  "Maximum price": "მაქსიმალური ფასი",
  "In stock": "მარაგში",
  "Reserved products": "დაჯავშნილი პროდუქტები",
  "Reserved products total": "დაჯავშნილი პროდუქტების ჯამი",
  Available: "ხელმისაწვდომი",
  "Available now": "ახლა ხელმისაწვდომი",
  "Purchase cost": "შესყიდვის ღირებულება",
  "Purchase Cost": "შესყიდვის ღირებულება",
  "Selling price": "გასაყიდი ფასი",
  "Product name": "პროდუქტის სახელი",
  "Product details": "პროდუქტის დეტალები",
  "Product details saved successfully.":
    "პროდუქტის დეტალები წარმატებით განახლდა.",
  "Inventory details saved successfully.":
    "მარაგის დეტალები წარმატებით განახლდა.",
  Details: "დეტალები",
  Image: "სურათი",
  Width: "სიგანე",
  Height: "სიმაღლე",
  Depth: "სიღრმე",
  Material: "მასალა",
  Color: "ფერი",
  Description: "აღწერა",
  "No category": "კატეგორიის გარეშე",
  "Active product": "აქტიური პროდუქტი",
  "Archived product (history retained)": "არქივშია (ისტორია შენარჩუნებულია)",
  "Only numbers and one decimal point are allowed.":
    "დაშვებულია მხოლოდ ციფრები და ერთი ათწილადის წერტილი.",
  "Enter a whole number using digits only.":
    "შეიყვანეთ მთელი რიცხვი მხოლოდ ციფრებით.",
  "Enter a valid numeric value.": "შეიყვანეთ სწორი რიცხვითი მნიშვნელობა.",
  "Enter a value within the allowed range.":
    "შეიყვანეთ მნიშვნელობა დაშვებულ დიაპაზონში.",
  "This numeric field is required.": "ეს რიცხვითი ველი სავალდებულოა.",
  "Enter a whole number without leading zeroes.":
    "შეიყვანეთ მთელი რიცხვი საწყისი ნულების გარეშე.",
  "Enter a number without leading zeroes, using at most one decimal point.":
    "შეიყვანეთ რიცხვი საწყისი ნულების გარეშე და გამოიყენეთ მაქსიმუმ ერთი ათწილადის წერტილი.",
  "Save details": "დეტალების შენახვა",
  "Product images": "პროდუქტის სურათები",
  "Primary image": "მთავარი სურათი",
  "Make primary": "მთავარ სურათად დაყენება",
  "Delete image": "სურათის წაშლა",
  "No product images.": "პროდუქტის სურათები არ არის.",
  "Add product": "პროდუქტის დამატება",
  "Delete / archive": "წაშლა / არქივში გადატანა",
  Delete: "წაშლა",
  "No records found.": "ჩანაწერები ვერ მოიძებნა.",
  "View note": "ნახვა",
  "View Notes": "შენიშვნების ნახვა",
  View: "ნახვა",
  Changes: "ცვლილებები",
  Note: "შენიშვნა",
  Close: "დახურვა",
  "Add Customer": "მომხმარებლის დამატება",
  "Add Supplier": "მომწოდებლის დამატება",
  "Add Contact": "კონტაქტის დამატება",
  phone: "ტელეფონი",
  address: "მისამართი",
  notes: "შენიშვნები",
  name: "სახელი",
  "Physical Stock": "ფიზიკური მარაგი",
  "Low Stock": "მცირე მარაგი",
  "Out of Stock": "მარაგში არ არის",
  "Available products": "ხელმისაწვდომი პროდუქტები",
  "Unique products registered": "რეგისტრირებული უნიკალური პროდუქტები",
  "Edit supplier": "მომწოდებლის რედაქტირება",
  "Supplier created successfully.": "მომწოდებელი წარმატებით შეიქმნა.",
  "Supplier saved successfully.": "მომწოდებლის მონაცემები წარმატებით განახლდა.",
  "Supplier deleted successfully.": "მომწოდებელი წარმატებით წაიშალა.",
  "Inventory Cost Value": "მარაგის ღირებულება",
  "Inventory records": "მარაგის ჩანაწერები",
  "Inventory actions": "მარაგის მოქმედებები",
  "Inventory details": "მარაგის დეტალები",
  "← Back to Inventory": "← მარაგში დაბრუნება",
  "Current quantity": "მიმდინარე რაოდენობა",
  "Reserved quantity": "დაჯავშნილი რაოდენობა",
  "Last import date": "ბოლო შემოტანილი",
  "Last imported date": "ბოლო შემოტანის თარიღი",
  "Last sale date": "ბოლო გაყიდული",
  "Product activity": "პროდუქტის აქტივობა",
  "Field changed": "შეცვლილი ველი",
  "Old value": "ძველი",
  "New value": "ახალი",
  "Changed by": "შეცვალა",
  User: "მომხმარებელი",
  Type: "ტიპი",
  Price: "ფასი",
  "Select supplier": "აირჩიეთ მომწოდებელი",
  "No supplier": "მომწოდებლის გარეშე",
  "No customer": "მომხმარებლის გარეშე",
  "Walk-in customer": "ადგილზე მოსული მომხმარებელი",
  Import: "შემოტანა",
  "Import date": "შემოტანის თარიღი",
  "Purchase price": "შესყიდვის ფასი",
  Adjustment: "კორექტირება",
  Reason: "მიზეზი",
  "Correction direction": "კორექტირების მიმართულება",
  "Adjustment date": "კორექტირების თარიღი",
  "Reservation Date": "დაჯავშნის თარიღი",
  "Destination warehouse": "დანიშნულების საწყობი",
  "Increase stock": "მარაგის გაზრდა",
  "Decrease stock": "მარაგის შემცირება",
  Result: "შედეგი",
  "Record adjustment": "კორექტირების ჩაწერა",
  Optional: "არასავალდებულო",
  Required: "სავალდებულო",
  RETURN: "დაბრუნება",
  LOST: "დაკარგული",
  DESTROYED: "დაზიანებული",
  CORRECTION: "კორექტირება",
  TRANSPORT: "ტრანსპორტირება",
  IMPORT: "შემოტანა",
  SALE: "გაყიდვა",
  SOLD: "გაყიდვა",
  RESERVED: "დაჯავშნილი",
  "SOLD (RESERVED)": "გაყიდული (დაჯავშნილი)",
  PENDING: "მოლოდინში",
  Employee: "თანამშრომელი",
  Reverse: "გაუქმება",
  Manage: "მოქმედება",
  Reserve: "დაჯავშნა",
  Cancel: "გააუქმა",
  Sold: "წაიღო",
  Created: "შექმნილია",
  "Cancelled reservation": "გაუქმებული ჯავშანი",
  "Selling price per unit": "ერთეულის გასაყიდი ფასი",
  "Unit price": "ერთეულის ფასი",
  "Reservation total": "ჯავშნის ჯამი",
  "Deposit paid": "გადახდილი დეპოზიტი",
  "Expiration date": "ვადის გასვლის თარიღი",
  Expires: "ვადა",
  "Employee name": "თანამშრომლის სახელი",
  Role: "როლი",
  "Add employee": "თანამშრომლის დამატება",
  ADMIN: "ადმინისტრატორი",
  EMPLOYEE: "თანამშრომელი",
  Enabled: "აქტიურია",
  Disabled: "გამორთულია",
  "Top-selling products": "ყველაზე გაყიდვადი პროდუქტები",
  "Sales over time": "გაყიდვები დროში",
  Today: "დღეს",
  "Out of stock": "მარაგი ამოიწურა",
  Revenue: "შემოსავალი",
  Transactions: "ტრანზაქციები",
  Discounts: "ფასდაკლებები",
  Discount: "ფასდაკლება",
  COGS: "გაყიდული საქონლის თვითღირებულება",
  "Gross profit": "მთლიანი მოგება",
  "Products sold": "გაყიდული პროდუქტები",
  "Units sold": "გაყიდული ერთეულები",
  Units: "ერთეულები",
  "Inventory cost": "მარაგის ღირებულება",
  "Retail value": "საცალო ღირებულება",
  "The page could not be displayed.": "გვერდის ჩვენება ვერ მოხერხდა.",
  Reload: "გადატვირთვა",
  "Login required": "საჭიროა სისტემაში შესვლა",
  "Invalid or expired login": "ავტორიზაცია არასწორია ან ვადა გაუვიდა",
  "This account is no longer active": "ეს ანგარიში აღარ არის აქტიური",
  "You do not have access to this action":
    "ამ მოქმედების შესრულების უფლება არ გაქვთ",
  "Invalid username or password": "მომხმარებლის სახელი ან პაროლი არასწორია",
  "No changes supplied": "ცვლილებები არ არის მითითებული",
  "No employee changes supplied": "თანამშრომლის ცვლილებები არ არის მითითებული",
  "Supplier not found": "მომწოდებელი ვერ მოიძებნა",
  "Product not found": "პროდუქტი ვერ მოიძებნა",
  "Category not found": "კატეგორია ვერ მოიძებნა",
  "Invoice not found": "ინვოისი ვერ მოიძებნა",
  "Image not found": "სურათი ვერ მოიძებნა",
  "Employee not found": "თანამშრომელი ვერ მოიძებნა",
  "Inventory location not found": "საწყობი ვერ მოიძებნა",
  "Reserved product not found": "დაჯავშნილი პროდუქტი ვერ მოიძებნა",
  "Inventory operation not found": "მარაგის მოქმედება ვერ მოიძებნა",
  "Route not found": "მისამართი ვერ მოიძებნა",
  "This invoice has no imports on that date":
    "ამ თარიღში ინვოისს შემოტანილი პროდუქტები არ აქვს",
  "Products with history must remain archived":
    "ისტორიის მქონე პროდუქტი არქივში უნდა დარჩეს",
  "Archived products cannot be sold": "დაარქივებული პროდუქტის გაყიდვა შეუძლებელია",
  "Assign a supplier to the product before recording this stock movement":
    "მარაგის ამ მოქმედების ჩაწერამდე პროდუქტს მომწოდებელი მიანიჭეთ",
  "Correction direction is required for a correction":
    "კორექტირებისთვის მიმართულების არჩევა სავალდებულოა",
  "Destination warehouse is required for transport":
    "ტრანსპორტირებისთვის დანიშნულების საწყობის არჩევა სავალდებულოა",
  "Source and destination warehouses must be different":
    "საწყისი და დანიშნულების საწყობები განსხვავებული უნდა იყოს",
  "This reserved product is already completed":
    "ეს დაჯავშნილი პროდუქტი უკვე დასრულებულია",
  "This reservation is no longer active": "ეს ჯავშანი აღარ არის აქტიური",
  "The reserved quantity is not consistent with current inventory":
    "დაჯავშნილი რაოდენობა მიმდინარე მარაგს არ შეესაბამება",
  "This inventory operation has already been reversed":
    "მარაგის ეს მოქმედება უკვე გაუქმებულია",
  "Returns cannot be reversed because their sale and refund records must remain consistent":
    "დაბრუნების გაუქმება შეუძლებელია, რადგან გაყიდვისა და თანხის დაბრუნების ჩანაწერები უცვლელი უნდა დარჩეს",
  "Sales and reservations must be handled through their dedicated workflows":
    "გაყიდვები და ჯავშნები შესაბამისი სამუშაო პროცესებიდან უნდა დამუშავდეს",
  "This operation cannot be reversed because it would invalidate current stock or reservations":
    "ამ მოქმედების გაუქმება შეუძლებელია, რადგან მიმდინარე მარაგს ან ჯავშნებს დაარღვევს",
  "This import cannot be reversed because some of its stock was already sold or moved":
    "ამ შემოტანის გაუქმება შეუძლებელია, რადგან მარაგის ნაწილი უკვე გაიყიდა ან გადაიტანეს",
  "This operation cannot be reversed because its invoice stock has already changed":
    "ამ მოქმედების გაუქმება შეუძლებელია, რადგან შესაბამისი ინვოისის მარაგი უკვე შეიცვალა",
  "Only employee passwords can be reset":
    "პაროლის განახლება მხოლოდ თანამშრომლისთვის შეიძლება",
  "The last active administrator cannot be disabled or changed to employee":
    "ბოლო აქტიური ადმინისტრატორის გამორთვა ან თანამშრომლად შეცვლა შეუძლებელია",
  "Use JPG, PNG, or WebP up to 5 MB":
    "გამოიყენეთ მაქსიმუმ 5 მბ ზომის JPG, PNG ან WebP ფაილი",
  "Maximum 5 images per product": "ერთ პროდუქტზე დაშვებულია მაქსიმუმ 5 სურათი",
  "The image must be 5 MB or smaller": "სურათის ზომა არ უნდა აღემატებოდეს 5 მბ-ს",
  "The image upload is not valid": "სურათის ატვირთვა არასწორია",
  "A product with this name already exists.":
    "ამ სახელის პროდუქტი უკვე არსებობს.",
  "A supplier with this name already exists.":
    "ამ სახელის მომწოდებელი უკვე არსებობს.",
  "A record with that value already exists": "ასეთი მნიშვნელობის ჩანაწერი უკვე არსებობს",
  "This record is still used by another part of the application":
    "ეს ჩანაწერი კვლავ გამოიყენება აპლიკაციის სხვა ნაწილში",
  "The supplied value is not valid": "მითითებული მნიშვნელობა არასწორია",
  "An unexpected server error occurred": "სერვერზე მოულოდნელი შეცდომა მოხდა",
  "Failed to fetch": "სერვერთან დაკავშირება ვერ მოხერხდა",
  "Network request failed": "ქსელური მოთხოვნა ვერ შესრულდა",
  "Enter a valid numeric value": "შეიყვანეთ სწორი რიცხვითი მნიშვნელობა",
  "Enter a whole number": "შეიყვანეთ მთელი რიცხვი",
  "Enter a number greater than zero": "შეიყვანეთ ნულზე მეტი რიცხვი",
  "Invoice code must contain digits only":
    "ინვოისის კოდი მხოლოდ ციფრებს უნდა შეიცავდეს",
  "Choose a valid calendar date": "აირჩიეთ სწორი კალენდარული თარიღი",
  "Invalid uuid": "იდენტიფიკატორი არასწორია",
  "Invalid input": "შეყვანილი მონაცემები არასწორია",
  "That username is already in use. Choose another username.":
    "ეს მომხმარებლის სახელი უკვე გამოიყენება. აირჩიეთ სხვა სახელი.",
  "This supplier has inventory history and cannot be deleted.":
    "ამ მომწოდებელს მარაგის ისტორია აქვს და მისი წაშლა შეუძლებელია.",
  "Why is this inventory operation being reversed?":
    "რატომ უქმდება მარაგის ეს მოქმედება?",
};

const english = Object.fromEntries(
  Object.entries(georgian).map(([source, translated]) => [translated, source]),
);

let activeLanguage: AppLanguage = readLanguage();
let translating = false;
let observer: MutationObserver | undefined;

export function readLanguage(): AppLanguage {
  return localStorage.getItem("language") === "Georgian"
    ? "Georgian"
    : "English";
}

function translatePhrase(value: string, language: AppLanguage) {
  if (language === "English") {
    const showing = value.match(/^ნაჩვენებია (\d+)-(\d+), სულ (\d+)$/);
    if (showing)
      return `Showing ${showing[1]}-${showing[2]} of ${showing[3]}`;
    const archivedCategory = value.match(
      /^კატეგორია დაარქივდა, რადგან მას კვლავ იყენებს (\d+) პროდუქტი\. საბოლოო წაშლამდე ამ პროდუქტებს სხვა კატეგორია მიანიჭეთ\.$/,
    );
    if (archivedCategory)
      return `Category archived because ${archivedCategory[1]} product(s) still use it. Reassign those products before permanent deletion.`;
    const requestFailed = value.match(/^მოთხოვნა ვერ შესრულდა \((\d+)\)$/);
    if (requestFailed) return `Request failed (${requestFailed[1]})`;
    return english[value] || value;
  }
  if (georgian[value]) return georgian[value];

  const showing = value.match(/^Showing (\d+)-(\d+) of (\d+)$/);
  if (showing)
    return `ნაჩვენებია ${showing[1]}-${showing[2]}, სულ ${showing[3]}`;

  const increase = value.match(/^Stock will increase by (.+)$/);
  if (increase) return `მარაგი გაიზრდება ${increase[1]}-ით`;
  const decrease = value.match(/^Stock will decrease by (.+)$/);
  if (decrease) return `მარაგი შემცირდება ${decrease[1]}-ით`;

  const requestFailed = value.match(/^Request failed \((\d+)\)$/);
  if (requestFailed) return `მოთხოვნა ვერ შესრულდა (${requestFailed[1]})`;
  const onlyAtLocation = value.match(
    /^Only (\d+) units are available at this location\.$/,
  );
  if (onlyAtLocation)
    return `ამ საწყობში ხელმისაწვდომია მხოლოდ ${onlyAtLocation[1]} ერთეული.`;
  const onlyInWarehouse = value.match(
    /^Only (\d+) units are available in (.+)\.$/,
  );
  if (onlyInWarehouse)
    return `საწყობში „${onlyInWarehouse[2]}“ ხელმისაწვდომია მხოლოდ ${onlyInWarehouse[1]} ერთეული.`;
  const onlyAvailable = value.match(/^Only (\d+) units are available\.$/);
  if (onlyAvailable)
    return `ხელმისაწვდომია მხოლოდ ${onlyAvailable[1]} ერთეული.`;
  const linkedSupplier = value.match(
    /^This supplier is linked to (\d+) product\(s\)\. Reassign them before deleting the supplier\.$/,
  );
  if (linkedSupplier)
    return `ეს მომწოდებელი დაკავშირებულია ${linkedSupplier[1]} პროდუქტთან. მომწოდებლის წაშლამდე პროდუქტებს სხვა მომწოდებელი მიანიჭეთ.`;
  const archivedCategory = value.match(
    /^Category archived because (\d+) product\(s\) still use it\. Reassign those products before permanent deletion\.$/,
  );
  if (archivedCategory)
    return `კატეგორია დაარქივდა, რადგან მას კვლავ იყენებს ${archivedCategory[1]} პროდუქტი. საბოლოო წაშლამდე ამ პროდუქტებს სხვა კატეგორია მიანიჭეთ.`;
  const newPassword = value.match(/^New password for (.+):$/);
  if (newPassword) return `ახალი პაროლი (${newPassword[1]}):`;
  const deleteCategory = value.match(
    /^Delete “(.+)”\? Referenced categories will be archived instead\.$/,
  );
  if (deleteCategory)
    return `წაიშალოს „${deleteCategory[1]}“? გამოყენებული კატეგორია წაშლის ნაცვლად დაარქივდება.`;
  const deleteInvoice = value.match(/^Delete invoice code “(.+)”\?$/);
  if (deleteInvoice) return `წაიშალოს ინვოისის კოდი „${deleteInvoice[1]}“?`;
  const deleteSupplier = value.match(/^Delete supplier “(.+)”\?$/);
  if (deleteSupplier) return `წაიშალოს მომწოდებელი „${deleteSupplier[1]}“?`;
  const sellReservation = value.match(
    /^Mark (.+) × (.+) as sold\? The reserved stock will be subtracted from (.+)\.$/,
  );
  if (sellReservation)
    return `${sellReservation[1]} × ${sellReservation[2]} მოინიშნოს გაყიდულად? დაჯავშნილი მარაგი გამოაკლდება საწყობს: ${sellReservation[3]}.`;
  const cancelReservation = value.match(
    /^Cancel the reservation of (.+) × (.+)\? The stock will become available again\.$/,
  );
  if (cancelReservation)
    return `გაუქმდეს ${cancelReservation[1]} × ${cancelReservation[2]}-ის ჯავშანი? მარაგი კვლავ ხელმისაწვდომი გახდება.`;
  const zodMinimum = value.match(
    /^String must contain at least (\d+) character\(s\)$/,
  );
  if (zodMinimum)
    return `ტექსტი უნდა შეიცავდეს მინიმუმ ${zodMinimum[1]} სიმბოლოს`;
  const zodMaximum = value.match(
    /^String must contain at most (\d+) character\(s\)$/,
  );
  if (zodMaximum)
    return `ტექსტი უნდა შეიცავდეს მაქსიმუმ ${zodMaximum[1]} სიმბოლოს`;
  if (
    /^Invalid enum value\./.test(value) ||
    /^Expected .+, received .+$/.test(value)
  )
    return "მითითებული მნიშვნელობა არასწორია";

  return value;
}

export function translateMessage(
  value: string,
  language: AppLanguage = readLanguage(),
) {
  return value
    .split("; ")
    .map((part) => translatePhrase(part, language))
    .join("; ");
}

function translateText(node: Text) {
  const parent = node.parentElement;
  if (!parent || parent.closest("script, style, [data-no-translate]"))
    return;

  const match = node.data.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match || !match[2]) return;
  const source = match[2];

  if (parent.tagName === "OPTION" && !parent.hasAttribute("value")) {
    parent.setAttribute("value", english[source] || source);
  }

  const translated = translatePhrase(source, activeLanguage);
  const next = match[1] + translated + match[3];
  if (next !== node.data) node.data = next;
}

function translateAttributes(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>("[placeholder], [title], [aria-label]")
    .forEach((element) => {
      for (const attribute of ["placeholder", "title", "aria-label"]) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const translated = translatePhrase(value, activeLanguage);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    });
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateText(root as Text);
    return;
  }
  if (!(root instanceof Element) && root !== document.body) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateText(node as Text);
    node = walker.nextNode();
  }
  translateAttributes(root as ParentNode);
}

export function applyLanguage(language: AppLanguage = readLanguage()) {
  activeLanguage = language;
  document.documentElement.lang = language === "Georgian" ? "ka" : "en";
  translating = true;
  translateTree(document.body);
  translating = false;
  window.dispatchEvent(new Event(languageEvent));
}

export function saveLanguage(language: AppLanguage) {
  localStorage.setItem("language", language);
  applyLanguage(language);
}

export function installLanguageSupport() {
  if (observer) return;
  observer = new MutationObserver((mutations) => {
    if (translating) return;
    translating = true;
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        translateText(mutation.target as Text);
      }
      for (const node of mutation.addedNodes) translateTree(node);
    }
    translating = false;
  });
  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  const nativeAlert = window.alert.bind(window);
  const nativeConfirm = window.confirm.bind(window);
  const nativePrompt = window.prompt.bind(window);
  window.alert = (message?: any) =>
    nativeAlert(translateMessage(String(message ?? "")));
  window.confirm = (message?: string) =>
    nativeConfirm(translateMessage(String(message ?? "")));
  window.prompt = (message?: string, defaultValue?: string) =>
    nativePrompt(translateMessage(String(message ?? "")), defaultValue);
  applyLanguage(activeLanguage);
}
