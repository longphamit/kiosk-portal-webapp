import { Col, Empty, Pagination, Row, Skeleton, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { FooterCard } from "../../../../@app/components/card/footer_card";
import { getListCategoriesService } from "../../../services/categories_service";

const currentTime = new Date();
const ApplicationPolicy = () => {
  const [totalCategory, setTotalCategory] = useState(0);
  const [listCategories, setListCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(async () => {
    const res = await getListCategoriesService("", 5, 1);
    setListCategories(res.data);
  }, []);

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    const res = await getListCategoriesService("", 5, page);
    setTotalCategory(res.data.metadata.total);
    setListCategories(res.data.data);
  };

  const columns = [
    {
      title: <p style={{ fontSize: 20, fontWeight: 'bold' }}>Application Category</p>,
      dataIndex: "name",
      key: "name",
      render: (text) => <p style={{ fontSize: 18 }}>{text}</p>,
    },
    {
      title: <p style={{ fontSize: 20, fontWeight: 'bold' }}>Commission Fee</p>,
      dataIndex: "commissionPercentage",
      key: "commissionPercentage",
      render: (text) => <Tag color="green" style={{ fontSize: 18 }}>{text}%</Tag>,
    },
  ];

  return (
    <>
      <div style={{ padding: '100px 300px 0px 300px', fontFamily: "Arial", fontSize: 20 }}>
        <Row>
          <Col span={10}>
            <img src="https://cdn.dribbble.com/users/1537480/screenshots/5299696/media/3133577255030afcbbef57bb914651c8.jpg" style={{ width: 500 }} />
          </Col>
          <Col span={14}>
            <h1
              style={{
                textAlign: "center",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                lineHeight: "100px",
                fontSize: 80,
              }}
            >
              Community Rules
            </h1>
            <p>
              We want to build a friendly and positive community here at IKFTS !
              Our Community Rules serve as a guideline for all buyers and
              sellers to preserve a safe environment for shopping and selling
              on-the-go. Go through these do's and don'ts when using our
              platform. By using IKFTS , you agree to our Terms of Service found
              here. We are committed to keeping our community safe with
              everybody's effort.
            </p>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>

            <h2
              style={{
                textAlign: "center",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                lineHeight: "100px",
                fontSize: 80,
              }}
            >
              The Do's
            </h2>
            <p>
              1. Sell, not advertise IKFTS is designed as a venue to assist
              transactions between buyers and sellers, and not a platform for
              advertisements. You should only list products that you are
              intending to sell on IKFTS . Here are some examples of
              advertising: Adding a link on your product page that leads to a
              separate website. Any text in your product description and/or
              photos informing buyers to reach you via other platforms such as
              Whatsapp or Facebook. (We understand the need for buyers and
              sellers to communicate with one another. The Chat Now function in
              IKFTS provides an easy way for both parties to connect!)
            </p>
            <p>
              2. Make your listing shine No buyer will be interested in a
              listing that has poor quality photos. Flaunt your photography
              skills and create some quality shots, check out our tips here.
              Aside from that, be honest! Give your product an accurate and
              detailed description. Nobody likes a nasty surprise when it comes
              to making a purchase. Being truthful will increase your chances of
              obtaining positive ratings and reviews from your buyers.
            </p>
            <p>
              3. Be respectful We want to foster a safe environment for people
              to enjoy mobile shopping. Keep your content clean and suitable for
              everyone. This means no vulgar language, hate messages, or spam.
              As a community in IKFTS , we urge all users to treat each other
              with kindness and respect. Whether you're a buyer or seller,
              follow the guidelines here to ensure smooth transactions for
              everyone!
            </p>
            <p>
              4. Maintain an excellent selling record Create a good customer
              experience by being attentive and responsive to your buyers'
              needs. Happy buyers are more likely to make repeat purchases and
              give you a positive seller rating.
            </p>
            <p>
              Keep your selling record clean by maintaining sufficient stock and
              by shipping orders on time to reduce unnecessary cancellations,
              returns, and refunds. To ensure a great experience for all users,
              IKFTS may send a caution to sellers with poor selling records. In
              some cases, IKFTS may also remove certain selling privileges (e.g.
              free shipping, preferred seller), lower your products' search
              ranking, limit, or suspend your account access.
            </p>
            <p>
              Here are some tips to maintain an excellent selling record:
              Monitor and update your stock at least once a day Provide a
              detailed and honest description, including actual pictures, of the
              items you are selling Respond to buyers' queries in a timely
              manner Ensure your products are in good condition before shipping
              Pack orders carefully to avoid damage during delivery Respond
              promptly to any refund requests If you have to cancel orders due
              to unforeseen events, inform buyers immediately with a valid
              reason
            </p>
            <h2
              style={{
                textAlign: "center",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                lineHeight: "100px",
                fontSize: 80,
              }}
            >
              The Don'ts
            </h2>
            <p>
              1. Posting services IKFTS does not allow users to list services on
              the platform.
            </p>
            <p>
              2. Counterfeit & imitation products Only genuine products can be
              listed on IKFTS . Please be aware that counterfeit products are
              prohibited. IKFTS reserves the right to report and delete any
              listing of a counterfeit nature.
            </p>
            <p>
              3. Transactions outside IKFTS Directing transactions outside IKFTS
              or asking the buyer to pay through means outside the IKFTS
              platform is prohibited. The following activities are not allowed
              on IKFTS : Seller is promoting business and directing IKFTS users
              outside of IKFTS (E.g. Directing users to another website to make
              purchases) Seller is sharing personal contact information and
              asking the recipient to contact him/her directly with the
              intention to buy/sell outside of IKFTS (e.g. phone/mobile number,
              personal payment information, email address, Facebook, other
              social media channels, etc.)
            </p>
            <p>
              4. Infringing content & impersonation Any deceptive manner of
              impersonation is a serious offense in IKFTS . If you choose to use
              someone else's photo, respect their rights, and give credit where
              it's due. Here are some examples of infringing content &
              impersonation: Collecting and using others' personal data without
              their consent (e.g. contact details, photo) Using someone's
              identity as your own for credibility purposes Help us keep the
              IKFTS community strong! If you find any user impersonating you or
              someone else, please contact us here.
            </p>
            <p>
              5. Putting irrelevant or an excessive number of search terms in
              the title and description It is important that users are able to
              quickly find what they are searching for. Putting in additional
              brands, keywords, or hashtags in the title or description that are
              irrelevant to the product may be flagged and banned by our system.
              Examples of what not to include: Multiple brands in one listing
              name (e.g., Nike Adidas Puma Reebok Under Armour Running Shoes)
              Mention of irrelevant brands in the product description (e.g.,
              Apple iPhone 6s product but mentions t Samsung or Nokia in product
              description) Repetitive keywords (e.g., Apple iPhone 6s Apple
              iPhone 6s Apple iPhone 6s Apple iPhone 6s Apple iPhone 6s)
            </p>
            <p>
              6. Creating multiple listings of the same product Please do not
              create multiple listings of the same product. Such listings are
              automatically banned by our system.
            </p>
            <p>
              7. Misleading Pricing Please do not list products at prices that
              you do not intend to sell them for (e.g.listing a product at P5.00
              then asking the buyer to pay P300). Such listings will
              automatically be banned by our system.
            </p>
            <p>
              8. Abusive behaviors and Scamming All voucher codes, rebates, and
              subsidies are meant to help sellers promote sales and grow their
              business. The following behaviors in any forms are strictly
              prohibited on our platform: Fake order creation Voucher abuse
              Subsidy and rebates abuse Scams We monitor all user accounts and
              make sure users comply with our community rules. Violation of
              these rules will result in a range of actions including but not
              limited to the following: Permanent account suspension Freezing of
              funds under IKFTS Guarantee, for investigation purposes Civil
              actions, claim for damages and/or interim or injunctive relief.
              Your feedback is of utmost importance to us and we would love to
              hear from you!
            </p>

            <h2
              style={{
                textAlign: "center",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                lineHeight: "100px",
                fontSize: 50,
              }}
            >
              Here is the price list of all our affiliate marketing {currentTime.getMonth() + 1 + '/' + currentTime.getFullYear()}
            </h2>
          </Col>
        </Row>
        {listCategories ? (
          listCategories.lenght === 0 ? (
            <>
              <Row justify="center" align="center" style={{ marginTop: 250 }}>
                <Col>
                  <Empty />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row justify="center" align="center" style={{ marginTop: 0 }}>
                <Col span={15}>
                  <Table
                    columns={columns}
                    dataSource={listCategories}
                    pagination={false}
                  />
                  <Pagination
                    style={{ textAlign: "center" }}
                    defaultCurrent={1}
                    total={totalCategory}
                    pageSize={5}
                    current={currentPage}
                    onChange={handleChangeNumberOfPaging}
                  />
                </Col>
              </Row>

            </>
          )
        ) : (
          <Skeleton />
        )}
        <FooterCard isBackgroud={false} />

      </div>
    </>
  );
};
export default ApplicationPolicy;
